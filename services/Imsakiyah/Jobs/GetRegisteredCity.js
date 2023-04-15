import Imsakiyah from "../../../models/Imsakiyah.js";

export const getRegisteredCity = async () => {
    try {
        return await Imsakiyah.aggregate([
            { $group: {
                _id: '$cityId', 
                provinceId: { "$first": "$provinceId" }
            }}
        ]);
    } catch (err) {
        throw err;
    }
}