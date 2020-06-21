const msgInput = document.getElementById('send');
const chatMsg = document.querySelector('.chatMsg');
const roomDiv = document.getElementById('roomName');
const userList = document.getElementById('userNames');
const {name, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

socket.emit('join', {name, room});

msgInput.addEventListener('submit', (event) => {
	// Grab message and emit to server
	event.preventDefault();
	const msg = event.target.elements.msgInput.value;
	socket.emit('chatMsg', msg);

	event.target.elements.msgInput.value = '';
	event.target.elements.msgInput.focus();
});

// Receives a message from server
socket.on('message', (message) => {
	output(message);
	chatMsg.scrollTop = chatMsg.scrollHeight;
});

// Receives user and room information
socket.on('roomInfo', ({room, users}) => {
	outputRoom(room);
	outputUser(users);
});

function output(message) {
	// Creates a div with a message
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `
		<p class="meta">${message.name}<span> [${message.time}]: </span></p>
		<p class="text">
			${message.message}
		</p>
	`;

	// Adds new message to chat container
	document.querySelector('.chatMsg').appendChild(div);
}

// Outputs room name
function outputRoom(room) {
	roomDiv.innerText = room;
}

// Outputs users in room for sidebar
function outputUser(users) {
	userList.innerHTML = `
	  ${users.map(user => `<li>${user.name}</li>`).join('')}
	`;
  }