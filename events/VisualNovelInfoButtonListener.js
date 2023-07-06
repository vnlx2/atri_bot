import { ModalBuilder, ActionRowBuilder, TextInputBuilder } from '@discordjs/builders';
import logger from '../services/logger_service.js';
import { TextInputStyle } from 'discord.js';
import RequestFeature from '../services/VisualNovel/Features/RequestFeature.js';

export default async (interaction, client, msg = null) => {
    try {
        const infoToolCollect = interaction.channel.createMessageComponentCollector();
    
        infoToolCollect.on('collect', async (i) => {
            try {
                if (i.user.id === interaction.user.id) {
                    if (i.customId.includes('vn-dl-request')) {
                        infoToolCollect.resetTimer();
                        const id = parseInt(i.customId.split('-')[3]);
                        const title = i.message.embeds[0].data.title;
                        const thumbnail = i.message.embeds[0].thumbnail.url;
                        const author = interaction.user.id;
                        await RequestFeature(id, title, thumbnail, client, author);
                        if (msg === null) {
                            i.update({ content: 'Your request has been sent.', embeds: [], components: [] });
                        }
                        await infoToolCollect.stop();
                    }
                    else if (i.customId.includes('vn-dl-report')) {
                        infoToolCollect.resetTimer();
                        const id = parseInt(i.customId.split('-')[3]);
                        const title = i.message.embeds[0].data.title;
                        const reportModal = new ModalBuilder()
                            .setCustomId(`vn-report-link-modal-${id}-${title}`)
                            .setTitle('Report Link')
                            .addComponents([
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('report-link-title')
                                        .setLabel('Link Name')
                                        .setStyle(TextInputStyle.Short)
                                        .setPlaceholder('Ex : [JP] Drive 1')
                                        .setRequired(true),
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('report-reason')
                                        .setLabel('Reason')
                                        .setStyle(TextInputStyle.Paragraph)
                                        .setMaxLength(200)
                                        .setPlaceholder('Please enter the reason for reporting')
                                        .setRequired(true),
                                ),
                        ]);
                        await i.showModal(reportModal);
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
    } catch (err) {
        console.log(err);
        // logger.error(err);
        await interaction.followUp({ embeds: [embed.errorEmbed(
            'Error', 
            'Waaahhhh....!!! An error was occured when process report link.\nPlease try again...~', client)] });
    }
};