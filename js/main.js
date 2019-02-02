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
            }
        });
    
        $username.val('');
    });    		
    
})