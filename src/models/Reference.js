import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Reference',
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
    industry:{
        type : String,
        required: true,
    },
    academic_year:{
        type: String,
        required: true,
    },
    type:{
        type:String,
        required: true,
    },
    urlSave:{
        type: String
    },
    result:{
        type:String,
    }}
    ,{
        autoCreate: false,
        autoIndex: true
    })
)