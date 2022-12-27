import { SlashCommandBuilder } from 'discord.js';
import vn_search from '../services/vn_search.js';
import vn_info_tools from '../events/vnInfoToolCollect.js';
import logger from '../services/logger_service.js';
import embed from '../helpers/embed.js';

async function handle(interaction, originInteraction, navigationCollect, client) {
	try {
		if (interaction.user.id != originInteraction.user.id) {
			throw new Error('The user id does not match the requesting user id');
		}
		if (interaction.isButton()) {
			await interaction.deferUpdate();
			if (interaction.customId.includes('next-page')) {
				this.resetTimer();
				const page = parseInt(interaction.customId.split('-')[3]);
				const title = interaction.customId.split('-')[0];
				const data = await vn_search.search(title, client, page);
				await interaction.editReply(data);
			}
			else if (interaction.customId.includes('prev-page')) {
				navigationCollect.resetTimer();
				const page = parseInt(interaction.customId.split('-')[3]);
				const title = interaction.customId.split('-')[0];
				const data = await vn_search.search(title, client, page);
				await interaction.editReply(data);
			}
		}
		else if (interaction.isStringSelectMenu() && interaction.customId === 'selected-result') {
			const info = await vn_search.info(parseInt(interaction.values[0]), client);
			const message = await originInteraction.followUp(info);
			await vn_info_tools(originInteraction, client, message);
			navigationCollect.stop(['VN was Selected']);
		}
	}
	catch (err) {
		throw err;
	}
}

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
		.setDMPermission(false),


	async execute(interaction, client) {
		try {
			// VN Info
			if (interaction.options.getSubcommand() === 'info') {
				await interaction.deferReply();
				const result = await vn_search.info(interaction.options.getInteger('id'), client);
				await interaction.editReply(result);

				vn_info_tools(interaction, client);
			}
			// VN Search
			else if (interaction.options.getSubcommand() === 'search') {
				// Send Search Result
				await interaction.deferReply();
				const result = await vn_search.search(interaction.options.getString('title'), client);
				await interaction.editReply(result);

				const navigationCollect = interaction.channel.createMessageComponentCollector({
					time: 15000,
				});

				navigationCollect.on('collect', async (i) => {
					try {
						await handle(i, interaction, navigationCollect, client);
					} catch(error) {
						await interaction.followUp({ embeds: [embed.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
						navigationCollect.stop(['VN was Selected']);
					}
				});

				navigationCollect.on('end', async () => {
					await interaction.deleteReply();
				});
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