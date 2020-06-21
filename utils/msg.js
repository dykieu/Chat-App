const time = require('moment');

function format(name, message) {
	return {
		name,
		message,
		time: time().format('h:mm a')
	};
}

module.exports = format;