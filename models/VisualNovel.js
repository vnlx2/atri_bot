import mongoose from "mongoose";
import mongooseFuzzySearching from "mongoose-fuzzy-searching";

// Schema
const linkSchema = mongoose.Schema({
    provider : {
        type: String,
        required: true
    },
    type : {
        type: String
    },
    platform: {
        type: String
    },
    url : {
        type: String,
        required: true
    }
});

const downloadLinkSchema = mongoose.Schema({
    jp_link : [linkSchema],
    en_link : [linkSchema],
    id_link : [linkSchema]
});

const VisualNovelSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    aliases: [{
        type: String
    }],
    length: {
        type: Number
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    downloadUrl: downloadLinkSchema
}, {
    timestamps: true
});

VisualNovelSchema.plugin(mongooseFuzzySearching, { fields: [
    {
        name: 'title',
        minSize: 3,
        weight: 3
    },
    {
        name: 'aliases',
        minSize: 3,
        prefixOnly: true
    }
] })

export default mongoose.model('visual_novels', VisualNovelSchema);