import Imsakiyah from "../../../models/Imsakiyah.js";
import { getCityId } from "../Jobs/GetCityId.js";
import embed from "../../../helpers/embed.js";

export const setFeature = async (userId, provinceId, cityName, client) => {
    try {
        const cityId = await getCityId(provinceId, cityName);
        if (cityId === null) {
            return { embeds: [embed.errorEmbed(
                'Invalid City Name', 
                'Waaahhhh....!!! Gomen (´;︵;`)\n' + 
                'The city not found.\nPlease try again...~', client)] };
        }
        const imsakiyah = await Imsakiyah({
            _id: userId,
            provinceId: provinceId,
            cityId: cityId
        });
        await imsakiyah.save();
        const embedBody = embed.embed(
            client.user.avatarURL, 'Success', 
            'Set Imsakiyah Succesfull.', 0x009000
        );

        return { embeds: [embedBody], ephemeral: false };
    } catch (err) {
        throw err;
    }
}