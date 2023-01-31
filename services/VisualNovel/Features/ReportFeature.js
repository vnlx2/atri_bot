import embed from "../../../helpers/embed.js";
import env from 'dotenv';

env.config();

export default async function (id, title, link, reason, thumbnail, client, author) {
    try {
        const channel = await client.channels.cache.get(process.env.VNL_FORUM_ID);
        return await channel.threads.create(
            { 
                name: `[Report] ${title}`,
                message: { 
                    embeds: [
                        embed.embed(
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
    } catch (err) {
        console.error(err);
        logger.error(err);
    }
}