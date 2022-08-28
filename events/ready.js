const birthday = require('../services/akashic_birthday_scheduler');
const logger = require('../services/logger_service');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`System Ready, Logged as ${client.user.tag}`);
		console.log(`Uptime: ${Date(Date.now()).toString()}`);
		logger.info(`System Ready, Logged as ${client.user.tag}`);
		logger.info(`Uptime: ${Date(Date.now()).toString()}`);
		birthday.set_schedule(client);
	},
};