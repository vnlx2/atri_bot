import Imsakiyah from "../../../models/Imsakiyah.js";

export const getUsers = async (cityId) => {
    try {
        return await Imsakiyah.find({ cityId: cityId }).select("_id");
    } catch (err) {
        throw err;
    }
}