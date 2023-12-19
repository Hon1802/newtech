import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Announcement',
    new Schema({
    id:{type: ObjectId},
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    author:{
        type : String,
        required: true,
    },
    time:{
        type: Date
    },
    imageUrl:{
        type:String
    }}
    ,{
        autoCreate: false,
        autoIndex: true
    })
)