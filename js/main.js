$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chatWindow');
    var $usernameForm = $("#UsernameForm");
    var $users = $('#users');
    var $username = $('#username');
    var $error = $('#error');

    $usernameForm.submit(function(e) {    				
        e.preventDefault();
        socket.emit('add_new_user', $username.val(), function(data){
            if(data) {
                $('#namesList').hide();
                $('#mainWindow').show();
            } else {
                $error.addClass('alert alert-danger');
                $error.html('Username is already taken');
            }
        });        
    
        $username.val('');
    }); 
    
    socket.on('usernames', function(data) {

        socket.on('get_user', function(user) {    

            var html = '<p class="bg-primary" style="background-color: #274472">Active Users' + ' (' + data.length + ')' + '</p>';

            for(i=0; i<data.length; i++) {
                if(data[i] == user) {
                    html += '<span class="bg-info"><span class="text-warning"> &#9679;  </span>' + '<span class="text-warning"> ' +  user + " </span>(You) &nbsp; - &nbsp;&nbsp;&nbsp;" + '<a class="text-danger" href="https://w13chat.herokuapp.com/">Disconnect</a>' + '</span><br>';
                } else {
                   html += '<span class="bg-success"><span class="text-success"> &#9679;  </span>' + '<span class="text-primary"> ' + data[i] + '</span></span><br>';
                }
            }

            $users.html(html);

        });

        socket.emit('getUser');    

    });

    $messageForm.submit(function(e) {
        e.preventDefault();
        var dt = new Date();
        socket.emit('send_message', $message.val(), dt);
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
    
})