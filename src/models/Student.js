import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Student',
    new Schema({
        id:{type: ObjectId},
        fullName:{
            type: String,
            required: true,
        },
        class:{
            type: String,
            required: true,
        },
        phone:{
            type: String,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        thesisId:{
            type: String,
            required: true,
        },
        status:{
            type:String,
            required:true        
        },
    },{
        autoCreate: false,
        autoIndex: true
    })
)