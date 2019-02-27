$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chatWindow');
    var $usernameForm = $("#UsernameForm");
    var $users = $('#users');
    var $username = $('#username');
    var $error = $('#error');

    function escaped(unescaped){
        return new Option(unescaped).innerHTML;
    }

    $usernameForm.submit(function(e) {    				
        e.preventDefault();
        socket.emit('add_new_user', $username.val(), function(data){
            if(data) {
                $('#namesList').hide();
                $('#mainWindow').show();
            } else {
                $error.addClass('alert alert-danger');
                $error.html('This username is already taken');
            }
        });        
    
        $username.val('');
    }); 
    
    socket.on('usernames', function(data) {

        preX();

        socket.on('get_user', function(user) {    

            var html = '<p class="bg-primary" style="background-color: #274472">Active Users' + ' (' + data.length + ')' + '</p>';

            for(i=0; i<data.length; i++) {
                if(data[i] == user) {
                    html += '<span class="bg-info"><span class="text-warning"> &#9679;  </span>' + '<span class="text-warning"> ' +  escaped(user) + " </span>(You) &nbsp; - &nbsp;&nbsp;&nbsp;" + '<a class="text-danger" href="https://rtpc.herokuapp.com/">Disconnect</a>' + '</span><br>';
                } else {
                   html += '<span class="bg-success"><span class="text-success"> &#9679;  </span>' + '<span class="text-primary"> ' + escaped(data[i]) + '</span></span><br>';
                }
            }

            $users.html(html);

        });

        socket.emit('getUser');    

    });

    $messageForm.submit(function(e) {
        e.preventDefault();
        var dt = new Date();
        $message.val() ? socket.emit('send_message', $message.val(), dt) : alert('Empty message not allowed');
        $message.val('');
    });

    let s_user;

    socket.on('getUserFromMsg', (user) => {           
        function set() {
            s_user = user; 
        };
        set();
    });

    function preX() {
        socket.emit('getUserFromMessage'); 
    }

    preX();
    
    socket.on('new_message', function(data) {
        socket.emit('getUserFromMessage');
        $chat.animate({ scrollTop: $(document).height() }, "slow");
        if(data.user == s_user || !s_user) {            
            $chat.append('<div class="outgoing_msg"><div class="sent_msg"><strong><p>' + escaped(data.user) + '</strong>: ' + escaped(data.msg) + '</p><span class="time_date">' +  moment().calendar(data.time) + '</span> </div></div></div>'); 
        } else {
            $chat.append('<div class="incoming_msg"><div class="recieved_msg"><div class="received_withd_msg"><strong><p>' + escaped(data.user) + '</strong>: ' + escaped(data.msg) + '</p><span class="time_date">' +  moment().calendar(data.time) + '</span> </div></div></div>');          
        }    
    });    				
    
})