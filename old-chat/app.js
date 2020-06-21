const io = require('socket.io')(3000);
const userIDs = {};

// Whenever user loads website
io.on('connect', socket => {
	socket.on('new-user', user => {
		userIDs[socket.id] = user;
		socket.broadcast.emit('new-connection', user);
	});
	
	// Grabs message
	socket.on('send-chat-msg', message => {
		// Sends message to everyone (Sends to chat-event in script.js)
		socket.broadcast.emit('chat-event', {msg: message, user: userIDs[socket.id] });
	});

	socket.on('disconnect', () => {
		// Display who let and deletes from array
		socket.broadcast.emit('user-disconnect', userIDs[socket.id]);
		delete userIDs[socket.id];
	});
});