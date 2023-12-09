import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Class',
    new Schema({
        id:{type: ObjectId},
        faculty:{
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
