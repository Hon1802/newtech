import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Score',
    new Schema({
        id:{type: ObjectId},
        thesisId:{
            type: String,
            required: true,
        },
        studentId:{
            type: String,
            required: true
        },
        score:{
            type: Number,
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