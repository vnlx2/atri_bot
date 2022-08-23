/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
const vn_search = require('../services/vn_search');
const embed_make = require('../helpers/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Visual Novel Search Engine')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Find Visual Novel By Title')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Please enter the title keyword you want to search')
                        .setRequired(true),
            ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get Visual Novel Info and Download Link')
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('Visual Novel ID from VNDB (Only ID not include \'v\')')
                        .setRequired(true),
                ),
        ),

    async execute(interaction, client) {
        try {
            // VN Info
            if (interaction.options.getSubcommand() === 'info') {
                await interaction.deferReply();
                const result = await vn_search.info(interaction.options.getInteger('id'), client);
                await interaction.editReply(result);
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
                    if (i.user.id === interaction.user.id) {
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
                        else if (i.isSelectMenu()) {
                            if (i.customId === 'selected-result') {
                                const info = await vn_search.info(parseInt(i.values[0]), client);
                                await interaction.followUp(info);
                                navigationCollect.stop(['VN was Selected']);
                            }
                        }
                    }
                });

                navigationCollect.on('end', async () => {
                    await interaction.deleteReply();
                });
            }
        }
        catch (err) {
            console.error(err);
            embed_make.embed(client.user.avatarURL, 'Error', 'An error was occured', 0xe01212);
        }
    },
};