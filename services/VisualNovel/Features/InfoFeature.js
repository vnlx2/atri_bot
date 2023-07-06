import FetchVisualNovelJob from "../Jobs/FetchVisualNovelJob.js";
import embed_maker from '../../../helpers/embed.js';
import logger from '../../logger_service.js';
import GenerateFieldsJob from "../Jobs/GenerateFieldsJob.js";
import AddDownloadUrlToFieldsJob from "../Jobs/AddDownloadUrlToFieldsJob.js";
import CreateButton from "../Jobs/CreateButton.js";
import { ActionRowBuilder } from "@discordjs/builders";

export default async function (code, client) {
    try {
		const result = await FetchVisualNovelJob(code);
		if (result.length === 0) {
            return { embeds: [embed.errorEmbed(
                'Not Found', 
                'Sorry, we didn\'t find the vn you are looking for, please check the vn id again.', 
                client)] };
		}
		const fields = GenerateFieldsJob(result);
        const requestButton = CreateButton(`vn-dl-request-${code}`, 'Request VN', 'primary', { name: "📄" });
        const buttons = new ActionRowBuilder({ 'components': [requestButton] });

        if (result.downloadUrl && Object.keys(result.downloadUrl) != 0) {
            AddDownloadUrlToFieldsJob(fields, result.downloadUrl);
            const reportButton = CreateButton(`vn-dl-report-${code}`, 'Report Link', 'secondary', { name: "📌" });
            buttons.addComponents(reportButton);
        }

		const embed = embed_maker.embed(
            client.user.avatarURL, result.title, 
            result.description, 0x5e11d9, `https://vndb.org/v${code}`, 
            fields, result.image
        );

        return { embeds: [embed], ephemeral: false, components: [buttons] };
	} catch (err) {
		console.error(err);
		// logger.error(err);
        return ({ embeds: [embed_maker.errorEmbed(
            'Error', 
            'Waaahhhh....!!! Gomen (´;︵;`)\n' + 
            'An error was occured when get VN info.\nPlease try again...~', client)] });
	}
}