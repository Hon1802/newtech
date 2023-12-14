import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Thesis',
    new Schema({
    id:{type: ObjectId},
    title:{
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true,
    },
    industry:{
        type : String,
        required: true,
    },
    description:{
        type: String,
        require: true
    },
    academic_year:{
        type: String,
        required: true,
    },
    time_start:{
        type: Date,
        required: true,
    },
    time_end:{
        type: Date,
        required: true,
    },
    author:[{
        id: String,
        name: String,
        class: String,
        major: String
    }],
    member:[{ 
        id: String,
        name: String,
        class: String,
        major: String
    }],
    instructor:[{ 
        id: String,
        name: String,
        faculty: String
    }],
    type:{
        type:String,
        required: true,
    },
    result:{
        type:String,
    },
    reference:[{ 
        reference : String,
    }],
    urlSave:[{ 
        type: String,
    }],
    // status: =-1 cancel, = 0 completed, = 1 register, =2 not register
    status:{
        type: Number,
        required: true,
    }}
    ,{
        autoCreate: false,
        autoIndex: true
    })
)
// 
// urlSave save url report