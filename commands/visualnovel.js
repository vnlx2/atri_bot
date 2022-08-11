/* eslint-disable indent */
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const VndbService = require('../services/vndb_service');
const dotenv = require('dotenv');
dotenv.config();

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
            // Initialized Service
            const vndbService = new VndbService(client);

            // VN Info
            if (interaction.options.getSubcommand() === 'info') {
                await interaction.deferReply();
                const result = await this.info(vndbService, interaction.options.getInteger('id'));
                await interaction.editReply(result);
            }
            // VN Search
            else if (interaction.options.getSubcommand() === 'search') {
                // Send Search Result
                await interaction.deferReply();
                const result = await this.search(vndbService, interaction.options.getString('title'), client);
                await interaction.editReply(result);

                // Listen Pagination and Selected VN
                let page = 1;
                client.on('interactionCreate', async i => {
                    try {
                        if (!i.isSelectMenu() && !i.isButton()) {
                            return;
                        }
                        else if (i.user.id == interaction.user.id) {
                            if (i.isButton()) {
                                if (i.customId === 'next-page') {
                                    page++;
                                    const data = await this.search(vndbService, interaction.options.getString('title'), client, page);
                                    await interaction.editReply(data);
                                }
                                else if (i.customId === 'prev-page') {
                                    page--;
                                    const data = await this.search(vndbService, interaction.options.getString('title'), client, page);
                                    await interaction.editReply(data);
                                }
                            }
                            else if (i.isSelectMenu()) {
                                if (i.customId === 'selected-result') {
                                    const info = await this.info(vndbService, parseInt(i.values[0]), client);
                                    await interaction.followUp(info);
                                    await interaction.deleteReply();
                                }
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
    },
    async info(vndbService, id, client) {
        try {
            const res = await vndbService.getInfo(id);
            if (res === null) {
                return ({ embeds: [this.errorEmbed('Not Found', 'Sorry, we didn\'t find the vn you are looking for, please check the vn id again.', client)] });
            }
            return { embeds: [res], ephemeral: false };
        }
        catch (err) {
            console.error(err);
        }
    },
    async search(vndbService, title, client, page = 1) {
        const res = await vndbService.findByTitle(title, page);
        if (res == null) {
            return ({ embeds: [this.errorEmbed('Not Found', 'Sorry, we didn\'t find the vn you are looking for, please try with another keyword.', client)] });
        }
        // Pagination Button
        const nextPageBtn = new ButtonBuilder()
                                .setCustomId('next-page')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(!res.next_page);
        const prevPageBtn = new ButtonBuilder()
                                .setCustomId('prev-page')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled((page == 1) ? true : false);
        const paginationBtns = new ActionRowBuilder()
                    .addComponents([prevPageBtn, nextPageBtn]);
        // Search Result Options Menu
        const options = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('selected-result')
                        .setPlaceholder('Please Select a Visual Novel')
                        .addOptions(res.items),
                );
        return { embeds: [res.results], ephemeral: false, components: [paginationBtns, options] };
    },
    errorEmbed(title, message, client) {
        return {
            color: 0xe01212,
            title: title, message,
            author: {
                name: 'ATRI Visual Novel Search Engine',
                icon_url: client.user.avatarURL(),
            },
            description: message,
            timestamp: new Date(),
            footer: {
                text: `ATRI Version: ${process.env.VERSION}`,
            },
        };
    },
};