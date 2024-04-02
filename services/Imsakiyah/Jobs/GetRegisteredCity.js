import Imsakiyah from "../../../models/Imsakiyah.js";

export const getCoordinate = async () => {
    try {
        return await Imsakiyah.find();
    } catch (err) {
        throw err;
    }
}