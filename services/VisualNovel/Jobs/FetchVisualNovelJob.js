import VisualNovel from "../../../models/VisualNovel.js";

export default async (id) => await VisualNovel.findOne({ code: id }).select('-__v -createdAt -updatedAt');