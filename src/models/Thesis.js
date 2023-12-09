import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Thesis',
    new Schema({
        id:{type: ObjectId},
    name:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    instructorId:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type:String,
        required: true,
    },
    progress:{
        type: Number,
        required:true,
    }
    },{
        autoCreate: false,
        autoIndex: true
    })
)