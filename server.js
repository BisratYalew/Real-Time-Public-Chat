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