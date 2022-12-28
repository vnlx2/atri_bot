import { SlashCommandBuilder } from 'discord.js';
import logger from '../services/logger_service.js';
import embed from '../helpers/embed.js';
import { info, search, team } from '../controllers/VisualNovelController.js';



export default {
	data: new SlashCommandBuilder()
		.setName('vn')
		.setDescription('Visual Novel Search Engine')
		.addSubcommand(subcommand =>
			subcommand
				.setName('search')
				.setDescription('Find Visual Novel by Title')
				.addStringOption(option =>
					option.setName('title')
						.setDescription('Please enter the title you want to search')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Get Visual Novel info from VNDB and Download link')
				.addIntegerOption(option =>
					option.setName('id')
						.setDescription('Visual Novel ID from VNDB (Only ID not include \'v\')')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand => 
			subcommand
				.setName('fantl')
				.setDescription('Get all Visual Novel FanTL or find FanTL by team name')
				.addStringOption(option =>
					option.setName('team_name')
						.setDescription('FanTL team name or keep it empty to get all teams')
				)
		)
		.setDMPermission(false),


	async execute(interaction, client) {
		try {
			if (interaction.options.getSubcommand() === 'info') {
				await info(interaction, client);
			}
			
			else if (interaction.options.getSubcommand() === 'search') {
				await search(interaction, client);
			}
			// FanTL Search
			else if(interaction.options.getSubcommand() === 'fantl') {
				await team(interaction, client);
			}
		}
		catch (err) {
			console.error('errornya udah sampe main execution');
			console.error(err);
			logger.error(err);
			await interaction.followUp({ embeds: [embed.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });          
		}
	},
};