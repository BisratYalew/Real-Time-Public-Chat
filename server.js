const express       = require('express');
const app           = express(); 
const server        = require('http').createServer(app);
const io            = require('socket.io').listen(server);
const config        = require('./config');


usernames = [];


const encodeHTML = (data) => {
    return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}


server.listen(process.env.PORT || config.PORT);

app.use(express.static("."));

// Send index.html file
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', (socket) => {
    
	socket.on('add_new_user', (data, cb) => {
        socket.username = data;
        
        if(usernames.indexOf(data) !== -1) {
            cb(false);
        } else {
            cb(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });    

    
	// Update Usernames
    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }    
    
    // Get User
    socket.on('getUser', () => {
        socket.emit('get_user', socket.username);
    });


    // Get User From Message
    socket.on('getUserFromMessage', () => {
        socket.emit('getUserFromMsg', socket.username);
    });
    
    // Send Message
    socket.on('send_message', (data, time) => {
        io.sockets.emit('new_message', {msg: encodeHTML(data), user: socket.username, time });
    });
    
    // Disconnect
    socket.on('disconnect', (data) => {
        if(!socket.username) return;
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    })

});