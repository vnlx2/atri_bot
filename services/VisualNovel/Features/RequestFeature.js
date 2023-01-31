import embed from "../../../helpers/embed.js";
import env from 'dotenv';

env.config();

export default async function (id, title, thumbnail, client, author) {
    try {
        const channel = await client.channels.cache.get(process.env.VNL_FORUM_ID);
        return await channel.threads.create(
            { 
                name: `[Request] ${title}`,
                message: {
                    embeds: [
                        embed.embed(
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
    } catch (err) {
        throw err;
    }
}