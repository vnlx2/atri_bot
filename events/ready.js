import birthdayInitialized from '../services/akashic_birthday_scheduler.js';
import imsakiyahScheduler from '../services/Imsakiyah/Features/NotifyFeature.js';
import logger from '../services/logger_service.js';

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`System Ready, Logged as ${client.user.tag}`);
		console.log(`Uptime: ${Date(Date.now()).toString()}`);
		await birthdayInitialized(client);
		await imsakiyahScheduler(client);
	},
};