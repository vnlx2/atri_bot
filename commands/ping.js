const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check ATRI response with pong reply'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};