import { SlashCommandBuilder } from 'discord.js';
import vn_search from '../services/vn_search.js';
import embed_make from '../helpers/embed.js';
import vn_info_tools from '../events/vnInfoToolCollect.js';
import logger from '../services/logger_service.js';

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
                        if (i.user.id === interaction.user.id) {
                            if (i.isButton()) {
                                await i.deferUpdate();
                                if (i.customId.includes('next-page')) {
                                    navigationCollect.resetTimer();
                                    const page = parseInt(i.customId.split('-')[3]);
                                    const title = i.customId.split('-')[0];
                                    const data = await vn_search.search(title, client, page);
                                    await i.editReply(data);
                                }
                                else if (i.customId.includes('prev-page')) {
                                    navigationCollect.resetTimer();
                                    const page = parseInt(i.customId.split('-')[3]);
                                    const title = i.customId.split('-')[0];
                                    const data = await vn_search.search(title, client, page);
                                    await i.editReply(data);
                                }
                            }
                            else if (i.isSelectMenu()) {
                                if (i.customId === 'selected-result') {
                                    const info = await vn_search.info(parseInt(i.values[0]), client);
                                    await interaction.followUp(info)
                                        .then(async (msg) => {
                                            await vn_info_tools(interaction, client, msg);
                                    });
                                    navigationCollect.stop(['VN was Selected']);
                                }
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                        logger.error(err);
                    }
                });

                navigationCollect.on('end', async () => {
                    await interaction.deleteReply();
                });
            }
        }
        catch (err) {
            console.error(err);
            logger.error(err);
            embed_make.embed(client.user.avatarURL, 'Error', 'An error was occured', 0xe01212);
        }
    },
};