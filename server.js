const express       = require('express');
const app           = express(); 
const server        = require('http').createServer(app);
const io            = require('socket.io').listen(server);


usernames = [];

server.listen(process.env.PORT || 3000);

app.use(express.static("."));

app.get('/', (req, res, next) => {

	res.sendFile(__dirname + '/index.html');

});


io.sockets.on('connection', function(socket) {

	socket.on('add_new_user', function(data, cb) {

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




});