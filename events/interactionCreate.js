/* eslint-disable indent */

// const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

/* eslint-disable no-trailing-spaces */ 
module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		try {
			// Execute Slash Command
			if (interaction.isChatInputCommand()) {
				const command = client.commands.get(interaction.commandName);
				if (!command) return;
				await command.execute(interaction, client);
			}
		}
		catch (err) {
			console.error(err);
			await interaction.reply({
				content: `An Error has occured. ${err}`,
				ephemeral: true,
			});
		}
	},
};