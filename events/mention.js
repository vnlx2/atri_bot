/* eslint-disable indent */
const { EmbedBuilder } = require('discord.js');
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
				if (message.content == `<@${client.user.id}>`) {
					const msg = random[Math.floor(Math.random() * 9)];
					message.channel.send((msg == ' Hentai!') ? `<@${message.author.id}> ${msg}`
						: `${msg}`);
				}
                else if (message.content.match(/\bembed\b/i)) {
                    const exampleEmbed = new EmbedBuilder()
                                    .setColor(0xfcba03)
                                    .setTitle('Some title')
                                    .setURL('https://vndb.org/v4')
                                    .setAuthor({ name: 'ATRI Visual Novel Search Engine', iconURL: client.user.avatarURL() })
                                    .setDescription('Some description here')
                                    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                                    .addFields(
                                        { name: 'Regular field title', value: 'Some value here' },
                                        { name: '\u200B', value: '\u200B' },
                                        { name: 'Inline field title', value: 'Some value here', inline: true },
                                        { name: 'Inline field title', value: 'Some value here', inline: true },
                                    )
                                    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                                    .setImage('https://i.imgur.com/AfFp7pu.png')
                                    .setTimestamp()
                                    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                    message.channel.send({ embeds: [exampleEmbed] });
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