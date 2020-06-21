const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const format = require('./utils/msg');
const {join, getUser, leave, getRoomDetails} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'Bot';
const Welcome = 'Welcome to a real time chatting app';

// Check for user connection event & send a message to client console
io.on('connect', (socket) => {
	socket.on('join', ({name, room}) => {
		// Creates a user + adds them to a room
		const userObj = join(socket.id, name, room);
		console.log(userObj);
		socket.join(userObj.room);

		// Welcomes message to new user
		socket.emit('message', format(bot, Welcome));

		// Indicates when a new user joins a specific chat room
		socket.broadcast.to(userObj.room).emit('message', format(bot, `${userObj.name} has joined the chat`));

		// Sending room/user info to client
		io.to(userObj.room).emit('roomInfo', {
			room: userObj.room,
			users: getRoomDetails(userObj.room)
		});
		console.log(userObj);
	});

	// Catch message emitted from client (Listen for a message)
	socket.on('chatMsg', (msg) => {
		//console.log('Message received');
		const userObj = getUser(socket.id);

		io.to(userObj.room).emit('message', format(`${userObj.name}`, msg));
	});

	// Broadcast to all users that someone left the chat
	socket.on('disconnect', () => {
		// Grab user + disconnect them
		const userObj = leave(socket.id);
		if (userObj) {
			io.to(userObj.room).emit('message', format(bot, `${userObj.name} has left the chat`));
			
			// Removes disconnected user info
			io.to(userObj.room).emit('roomInfo', {
				room: userObj.room,
				users: getRoomDetails(userObj.room)
			});
		}
	});
});

// What Port the app is on
const port = (process.env.PORT || 3000);
server.listen(port, () => {
	console.log(`App is running on: http://localhost:${port}`);
});

// Joins current directory to public folder (Sets as static folder)
app.use(express.static(path.join(__dirname, 'public')));
