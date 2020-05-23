const socket = io('http://localhost:3000');
const msgForm = document.getElementById('send');
const msgContainer = document.getElementById('msg-container');
let msgInput = document.getElementById('msg-input');

// Grabs info of new users
const user = prompt('What is your name?');
appendMsg(`You have joined the chat`);
socket.emit('new-user', user);

socket.on('chat-event', data => {
	appendMsg(`${data.user}: ${data.msg}`);
});

// Displays when a user other than yourself joins the chat
socket.on('new-connection', data => {
	appendMsg(`${data} has joined the chat`);
});

socket.on('user-disconnect', user => {
	appendMsg(`${user} has left the chat`);
});

// Looks for when a message is sent
msgForm.addEventListener('submit', form => {
	// Prevents page from sending to server / refreshing page
	form.preventDefault();
	const msg = msgInput.value;

	//Display your message
	appendMsg(`You: ${msg}`);
	// send message to server then clears string
	socket.emit('send-chat-msg', msg);
	msgInput.value = '';
});

function appendMsg(msg) {
	const msgEle = document.createElement('div');
	msgEle.innerText = msg;
	msgContainer.append(msgEle);
}