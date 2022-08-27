/* eslint-disable indent */
const moment = require('moment');
// const VndbService = require('../services/vndb_service');

// const vndbService = VndbService

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message, client) {
		try {
			const random = ['Hi', 'Nani', 'Haiii....', 'Jangan panggil aku!', 'Kangen ya? hehe', 'Menjauh dasar mesum!', 'Sini peluk', 'Ada apa sayang?', ' Hentai!'];

			if (message.author.bot) return false;

			if (message.content.includes('@here') || message.content.includes('@everyone') || message.type == 'REPLY') return false;

			if (message.mentions.has(client.user.id)) {
				console.info(`${message.author.username} mentions Me`);
				if (message.content == `<@${client.user.id}>`) {
					const msg = random[Math.floor(Math.random() * 9)];
					message.channel.send((msg == ' Hentai!') ? `<@${message.author.id}> ${msg}`
						: `${msg}`);
				}
				else if (moment().month() == 7 && moment().date() == 28) {
					console.log('Birthday Time');
					const content = message.content.toLowerCase();
					if (content.includes('birthday') || content.includes('ulang tahun') || content.includes('tanjoubi')) {
						message.channel.send(`Thank you ucapannya, <@${message.author.id}>... Atri bahagia deh jadinya :slight_smile:`);
					}
				}
				else {
					message.channel.send('Maaf, ATRI masih belum mengerti');
				}
			}
		}
		catch (err) {
			console.error(err);
		}
	},
};