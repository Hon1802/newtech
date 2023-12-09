import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Category',
    new Schema({
        id:{type: ObjectId},
        name:{
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