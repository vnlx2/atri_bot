import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check ATRI response with pong reply'),
	async execute(interaction) {
		await interaction.reply('Kyaa~!');
	},
};