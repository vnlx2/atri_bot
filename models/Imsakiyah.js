import mongoose from "mongoose";

// Schema
const Imsakiyah = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    longitude:{
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

export default mongoose.model('imsakiyahs', Imsakiyah);