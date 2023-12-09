import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Task',
    new Schema({
        id:{type: ObjectId},
        thesisId:{
            type: String,
            required: true,
        },
        job:{
            type: String,
            required: true,
        },
        submission:{
            type: String,
            default:null,
        },
        confirm:{
            type: Boolean,
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