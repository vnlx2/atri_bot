import VisualNovel from "../../../models/VisualNovel.js";

export default async (title) => await VisualNovel.countDocuments({ title: new RegExp(title, 'i') });