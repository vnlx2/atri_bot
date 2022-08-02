/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
const VndbService = require('../services/vndb_service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vn-info')
		.setDescription('Tampilkan info vn dan link download. (Hasil pencarian tidak dapat dilihat oleh member lainnya)')
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('VNDB ID')
				.setRequired(true),
		),
	async execute(interaction, client) {
        try {
            // Initialized Service
            const vndbService = new VndbService(client);

            const res = await vndbService.getInfo(interaction.options.getInteger('id'));
            if (res == null) {
                await interaction.reply('Visual Novel Not Found');
            }
            await interaction.reply({ embeds: [res], ephemeral: true });
        }
        catch (err) {
            console.error(err);
        }
	},
};