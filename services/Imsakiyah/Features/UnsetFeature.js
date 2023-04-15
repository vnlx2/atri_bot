import embed from "../../../helpers/embed.js";
import Imsakiyah from "../../../models/Imsakiyah.js";

export const unsetFeature = async (userId, client) => {
    try {
        await Imsakiyah.deleteOne({ _id: userId });

        const embedBody = embed.embed(
            client.user.avatarURL, 'Success', 
            'Unset Imsakiyah Succesfull.', 0x009000
        );

        return { embeds: [embedBody], ephemeral: false };
    } catch (err) {
        throw err;
    }
}