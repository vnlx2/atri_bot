import { SlashCommandBuilder } from "discord.js";
import { autocompleteProvince, set, unset } from "../controllers/ImsakiyahController.js";

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
                        .setName('coordinate')
                        .setDescription('Please enter coordinate')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('unset')
                .setDescription('Unset imsakiyah configuration')
        ),
    async execute(interaction, client) {
        try {
            if (interaction.options.getSubcommand() === 'set') {
				await set(interaction, client);
			}
            else if (interaction.options.getSubcommand() === 'unset') {
                await unset(interaction, client);
            }
        } catch (err) {
            console.error(err);
			await interaction.followUp({ embeds: [embed.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
        }
    },
}