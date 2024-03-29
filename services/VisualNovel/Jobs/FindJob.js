import VisualNovel from "../../../models/VisualNovel.js";

export default async function (title, page = 1) {
    try {
        const regex = new RegExp(title, "i");
        return await VisualNovel.fuzzySearch(
            { 
                query: title,
                minSize: 3,
                prefixOnly: true,
            }
        ).collation({ locale: "en_US", numericOrdering: true })
        .sort({ code: 1, title: 1 }).limit(5).skip(5 * (page - 1));
    } catch (err) {
        throw err;
    }
}