import { ActionRowBuilder, SelectMenuBuilder } from "@discordjs/builders";
import embed from "../../../helpers/embed.js";
import logger from "../../logger_service.js";
import CreateButton from "../Jobs/CreateButton.js";
import FindJob from "../Jobs/FindJob.js";
import GenerateSearchResult from "../Jobs/GenerateSearchResult.js";
import GetTotal from "../Jobs/GetTotal.js";

export default async function (title, client, page = 1) {
    try {
        const results = await FindJob(title, page);
        if (results.length === 0) {
            return { embeds: [embed.errorEmbed(
                `${title} not found`, 
                'Sorry, we didn\'t find the Visual Novel you are looking for.\n' +
                'Please try different keywords or make sure that all words are spelled correctly.',
                client)] };
		}
        const total = await GetTotal(title);
        const isEndPage = !(total > (5 * page));
        const searchResult = GenerateSearchResult(results, page);
        const searchResultField = embed.embed(client.user.avatarURL, 'Search Results', searchResult.resultString, 0x205bba);
        const nextButton = CreateButton(`${title}-next-page-${page + 1}`, 'Next', 'primary', {}, null, isEndPage);
        const previousButton = CreateButton(`${title}-prev-page-${page - 1}`, 'Previous', 'primary', {}, null, (page === 1));
        const buttons = new ActionRowBuilder({
            components: [previousButton, nextButton]
        });
        const selectBox = new ActionRowBuilder({
            components: [
                new SelectMenuBuilder({
                    custom_id: 'selected-result',
                    placeholder: 'Please Select a Visual Novel',
                    options: searchResult.options
                })
            ]
        });

        return { embeds: [searchResultField], ephemeral: false, components: [buttons, selectBox], fetchReply: true };
    } catch (err) {
        console.error(err);
		// logger.error(err);
        return { embeds: [embed.errorEmbed(
            'Error', 
            'Waaahhhh....!!! Gomen (´;︵;`)\n' + 
            'An error was occured when find VN info.\nPlease try again...~', client)] };
    }
}