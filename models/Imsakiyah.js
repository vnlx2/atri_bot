import mongoose from "mongoose";

// Schema
const Imsakiyah = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    provinceId:{
        type: String,
        required: true
    },
    cityId: {
        type: String,
        required: true
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

export default mongoose.model('imsakiyah_user', Imsakiyah);