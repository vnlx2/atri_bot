/* eslint-disable indent */
import vndb_service from './vndb_service.js';
import embed_maker from '../helpers/embed.js';
import logger from './logger_service.js';
import { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import VisualNovel from '../models/VisualNovel.js';

function addDownloadLink(information, downloadUrls) {
    // Add Download Link Header
    information.fields.push({ name: '\u200B', value: '**Download Link**' });

    // Add Hyperlinks
    const languages = { 'JP': downloadUrls.jp_link, 'EN': downloadUrls.en_link, 'ID': downloadUrls.id_link };
    for (const [language, urls] of Object.entries(languages)) {
        let links = '';
        let provider = '';
        let index = 1;
        for (const url of urls) {
            if (provider != url.provider) {
                index = 1;
                provider = url.provider;
            }
            links += `[${provider} ${index}](${url.url}) `;
            index++;
        }
        if (links) {
            information.fields.push({ name: language, value: links });
        }
    }
    return information;
}

// Show VN information and download links
const info = async (id, client) => {
    try {
        const information = await vndb_service.getInfo(client, id);
        if (information.title === 'Not Found') {
            return { embeds: [information], ephemeral: false };
        }

        // Fetch Download link
        const dlLinks = await VisualNovel.findOne({ code: id }).select('-__v -createdAt -updatedAt');

        // Create VN request button
        const requestDL = new ButtonBuilder()
            .setCustomId(`vn-dl-request-${id}`)
            .setLabel('Request VN')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false)
            .setEmoji({ id: "1017802961767895100", name: ":ichiko_haha:" })
        const VNDownloadTool = new ActionRowBuilder()
            .addComponents([requestDL]);

        // Add Download Link (if available)
        if (dlLinks && (dlLinks.jp_link.length || dlLinks.en_link.length || dlLinks.id_link.length)) {
            addDownloadLink(information, dlLinks);

            // VN Report Link
            const reportDL = new ButtonBuilder()
                .setCustomId(`vn-dl-report-${id}`)
                .setLabel('Report Link')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji({ name: "🚩" });
            VNDownloadTool.addComponents(reportDL);
        }
        return { embeds: [information], ephemeral: false, components: [VNDownloadTool] };
    }
    catch (err) {
        console.error(err);
        logger.error(err);
        return ({ embeds: [embed_maker.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
    }
};

// Find VN based on title
const search = async (title, client, page = 1) => {
    try {
        const result = await vndb_service.findByTitle(client, title, page)
        if (!result.items.length) {
            return ({ embeds: [embed_maker.errorEmbed('Not Found', 'Sorry, we didn\'t find the vn you are looking for, please try with another keyword.', client)] });
        }
        // Pagination Button
        const nextPageBtn = new ButtonBuilder()
            .setCustomId(`${title}-next-page-${page + 1}`)
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(!result.next_page);
        const prevPageBtn = new ButtonBuilder()
            .setCustomId(`${title}-prev-page-${page - 1}`)
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
                    .addOptions(result.items),
            );
        return { embeds: [result.results], ephemeral: false, components: [paginationBtns, options], fetchReply: true };
    }
    catch (err) {
    console.error(err);
    logger.error(err);
    return ({ embeds: [embed_maker.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
}
};

// Send download link request
const request = async (id, title, thumbnail, client, author) => {
    try {
        const channel = await client.channels.cache.get(process.env.VNL_FORUM_ID);
        return await channel.threads.create(
            { 
                name: `[Request] ${title}`,
                message: {
                    embeds: [
                        embed_maker.embed(
                            client.user.avatarURL(), 
                            'Request Visual Novel', 
                            `**${title}**\n
                            Link\n[https://vndb.org/v${id}](https://vndb.org/v${id})
                            \nRequest by: <@${author}>`,
                            0x325aab, `https://vndb.org/v${id}`,
                            null, thumbnail)
                        ] 
                },
                appliedTags: [process.env.VNL_REQUEST_TAG_ID]
            });
    }
    catch (err) {
        console.error(err);
        logger.error(err);
    }
};

// Send report link
const report = async (id, title, link, reason, thumbnail, client, author) => {
    try {
        const channel = await client.channels.cache.get(process.env.VNL_FORUM_ID);
        return await channel.threads.create(
            { 
                name: `[Report] ${title}`,
                message: { 
                    embeds: [
                        embed_maker.embed(
                            client.user.avatarURL(), 
                            'Report Visual Novel', 
                            `**${title}**\n
                            VNDB Link : [https://vndb.org/v${id}](https://vndb.org/v${id})\n
                            Link Name : ${link}\nReason : ${reason}
                            \nReported by: <@${author}>`, 
                            0x325aab, `https://vndb.org/v${id}`,
                            null, thumbnail)
                        ]  
                },
                appliedTags: [process.env.VNL_REPORT_TAG_ID]
        });
    }
    catch (err) {
        console.error(err);
        logger.error(err);
    }
};

export default {
    info,
    search,
    request,
    report,
};