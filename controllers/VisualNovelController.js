import VNInfoButtonListener from '../events/VisualNovelInfoButtonListener.js';
import InfoFeature from "../services/VisualNovel/Features/InfoFeature.js";
import FindFeature from "../services/VisualNovel/Features/FindFeature.js";
import logger from "../services/logger_service.js";
import embed from '../helpers/embed.js';

// Handle VN Search navigation collect
async function handle(interaction, originInteraction, navigationCollect, client) {
    try {
        if (interaction.user.id != originInteraction.user.id) {
            throw new Error('The user id does not match the requesting user id');
        }
        if (interaction.isButton()) {
            await interaction.deferUpdate();
            if (interaction.customId.includes('next-page')) {
                navigationCollect.resetTimer();
                const page = parseInt(interaction.customId.split('-')[3]);
                const title = interaction.customId.split('-')[0];
                const data = await FindFeature(title, client, page);
                await interaction.editReply(data);
            }
            else if (interaction.customId.includes('prev-page')) {
                navigationCollect.resetTimer();
                const page = parseInt(interaction.customId.split('-')[3]);
                const title = interaction.customId.split('-')[0];
                const data = await FindFeature(title, client, page);
                await interaction.editReply(data);
            }
        }
        else if (interaction.isStringSelectMenu() && interaction.customId === 'selected-result') {
            const info = await InfoFeature(parseInt(interaction.values[0]), client);
            await originInteraction.followUp(info);
            await VNInfoButtonListener(originInteraction, client);
            navigationCollect.stop(['VN was Selected']);
        }
    }
    catch (err) {
        throw err;
    }
}

// VN Info
export const info = async (interaction, client) => {
    await interaction.deferReply();
    const result = await InfoFeature(interaction.options.getInteger('id'), client);
    await interaction.editReply(result);

    VNInfoButtonListener(interaction, client);
}

// VN Search
export const search = async (interaction, client) => {
    // Send Search Result
    await interaction.deferReply();
    const result = await FindFeature(interaction.options.getString('title'), client);
    await interaction.editReply(result);

    const navigationCollect = interaction.channel.createMessageComponentCollector({
        time: 15000,
    });

    navigationCollect.on('collect', async (i) => {
        try {
            await handle(i, interaction, navigationCollect, client);
        } catch (error) {
            logger.error(error);
            console.log(error);
            await interaction.followUp({ embeds: [embed.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
            navigationCollect.stop(['vn_info_tools was Selected']);
        }
    });

    navigationCollect.on('end', async () => {
        await interaction.deleteReply();
    });
}

// FanTL Team Search
export const team = async (interaction, client) => {
    try {
        console.log('TODO'); // TODO : Fantl search
        await interaction.reply({ embeds: [embed.embed(client.user.avatarURL, 'Coming Soon', 'Tch.. Tch.. Tch...\nFitur ini masih pengembangan loh, nanti ATRI kabarkan kalau udah selesai yah...~', 0xFFB100, null, null, null, 'https://cdn.discordapp.com/attachments/889918535139201064/929424964757635102/unknown.png')] });
    } catch (error) {
        logger.error(error);
        await interaction.followUp({ embeds: [embed.errorEmbed('Error', 'Waaahhhh....!!! An error was occured.\nPlease try again...~', client)] });
        navigationCollect.stop(['vn_info_tools was Selected']);
    }
}