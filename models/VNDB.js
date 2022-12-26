import mongoose from "mongoose";

// Schema
const VNDB = mongoose.Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
    aliases: { type: String },
    length: { type: Number },
    rating: { type: Number },
    description: { type: String },
    image: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('vndbs', VNDB);