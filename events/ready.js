const birthday = require('../services/akashic_birthday_scheduler');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`System Ready, Logged as ${client.user.tag}`);
		console.log(`Uptime: ${Date(Date.now()).toString()}`);
		birthday.set_schedule(client);
	},
};