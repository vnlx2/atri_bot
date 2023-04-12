import { SlashCommandBuilder } from "discord.js";
import { autocompleteProvince } from "../controllers/ImsakiyahController.js";
import logger from "../services/logger_service.js";

export default {
    data: new SlashCommandBuilder()
        .setName('imsakiyah')
        .setDescription('Imsak time reminder feature and prayer times')
        .setDMPermission(true)
        .addSubcommand(subcommand => 
            subcommand
                .setName('set')
                .setDescription('Set imsakiyah configuration')
                .addStringOption(option => 
                    option
                        .setName('province')
                        .setDescription('Please enter your province')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option
                        .setName('city')
                        .setDescription('Please enter your city')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        ),
    async autocomplete(interaction) {
        await autocompleteProvince(interaction);
    },
    async execute(interaction) {
        try {
            if (interaction.options.getSubcommand() === 'info') {
				await info(interaction, client);
			}
        } catch (err) {
            console.error(err);
			logger.error(err);
			await interaction.followUp({ embeds: [embed.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
        }
    },
}