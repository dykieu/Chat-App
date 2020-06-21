const users = [];

function join(id, name, room) {
	const user = {
		id,
		name,
		room
	};

	users.push(user);
	return user;
}

function getUser(id) {
	return users.find(user => user.id === id);

}

// Removes user from array
function leave(id) {
	const i = users.findIndex(user => user.id === id);
	if (i !== -1) {
		return users.splice(i, 1)[0];
	}
}

// Grabs users within a room
function getRoomDetails(room) {
	return users.filter(user => user.room === room);
}

module.exports = {
	join,
	getUser,
	leave,
	getRoomDetails
};