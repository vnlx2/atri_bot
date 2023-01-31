import moment from 'moment';
import dotenv from 'dotenv';
import logger from '../services/logger_service.js';

dotenv.config();

// const vndbService = VndbService

export default {
	name: 'messageCreate',
	once: false,
	execute(message, client) {
		try {
			const random = ['Hi', 'Nani', 'Haiii....', 'Jangan panggil aku!', 'Kangen ya? hehe', 'Menjauh dasar mesum!', 'Sini peluk', 'Ada apa sayang?', ' Hentai!'];

			// Cegak Bot Respon ketika mention all atau respon diri sendiri
			if (message.author.bot) return false;
			if (message.content.includes('@here') || message.content.includes('@everyone') || message.type == 'REPLY') return false;

			if (message.mentions.has(client.user.id)) {
				console.info(`${message.author.username} mentions Me`);
				logger.info(`${message.author.username} mentions Me`);
				// Kalau ATRI Ultah (28 Agustus)
				if (moment().month() == 7 && moment().date() == 28) {
					console.log('Birthday Time');
					logger.info('Birthday Time');
					const content = message.content.toLowerCase();
					if (content.includes('birthday') || content.includes('ulang tahun') || content.includes('tanjoubi')) {
						message.channel.send(`Thank you ucapannya, <@${message.author.id}>... Atri bahagia deh jadinya :slight_smile:`);
					}
				}
				// Kalau Mention Bot tanpa pesan
				if (message.content === `<@${client.user.id}>`) {
					const msg = random[Math.floor(Math.random() * 9)];
					message.channel.send((msg == ' Hentai!') ? `<@${message.author.id}> ${msg}`
						: `${msg}`);
				}
				// Respon ketika ada ucapan Pagi dan malam
				else if (message.content.toLowerCase().match(/\bohayou\b|\bpagi\b/i)) {
					if (moment().hour() >= 11 && moment().hour() < 16) {
						message.channel.send(`<@${message.author.id}>-san, sudah siang loh...`);
					}
					else if (moment().hour() >= 16 && moment().hour() < 19) {
						message.channel.send(`<@${message.author.id}>-san, sudah sore loh...`);
					}
					else if (moment().hour() >= 19 && moment().hour() < 24) {
						message.channel.send(`<@${message.author.id}>-san, sudah malam loh...`);
					}
					else if (message.author.id === process.env.REI_ID) {
							message.channel.send('Ohayou, Goshuujin-sama');
					}
					else {
						message.channel.send(`Ohayou, <@${message.author.id}>-san`);
					}
				}
				else if (message.content.toLowerCase().match(/\boyasumi\b|\bgood night\b/i)) {
					if (moment().hour() >= 4 && moment().hour() < 11) {
						message.channel.send(`<@${message.author.id}>-san, sudah siang loh...`);
					}
					else if (moment().hour() >= 11 && moment().hour() < 16) {
						message.channel.send(`<@${message.author.id}>-san, sudah sore loh...`);
					}
					else if (moment().hour() >= 16 && moment().hour() < 19) {
						message.channel.send(`<@${message.author.id}>-san, sudah malam loh...`);
					}
					else if (message.author.id === process.env.REI_ID) {
						message.channel.send(`Hai, Hizamakura desu! Hehe... Yoshi yoshi~ <@${message.author.id}>-sama! Oyasumi`);
						message.channel.send('https://cdn.discordapp.com/attachments/853972029983293440/963486674749366352/unknown.png');
					}
					else if (message.author.id === process.env.MOON_ID) {
						message.channel.send(`Hehehe, there you are bedtime♪ Have a nice, peaceful sleep! <@${message.author.id}>-san! Daisuki yo...`);
						message.channel.send('https://media.discordapp.net/attachments/955866146060517416/963305097864044596/unknown.png');
					}
					else {
						message.channel.send(`Oyasumi, <@${message.author.id}>-san`);
						message.channel.send('https://cdn.discordapp.com/attachments/955866146060517416/963302540416520212/unknown.png');
					}
				}
				// Respon ucapan lainnya
				else if (message.content.toLowerCase().match(/\btag kyamete\b|\bkawai\b/i)) {
					message.channel.send(`Mooo.... hazukashii yo, <@${message.author.id}>-san`);
				}
				else if (message.content.toLowerCase().match(/\bteteh itu siapa?\b/i)) {
					message.channel.send('Trainer kesayangan manhattan cafe');
				}
				else if (message.content.toLowerCase().match(/\b:zeana:\b/i)) {
					message.channel.send('なんでやねん！');
				}
				else {
					message.channel.send('Maaf, ATRI masih belum mengerti');
				}
			}
		}
		catch (err) {
			console.error(err);
			logger.error(err);
		}
	},
};