import mongoose, { Schema } from "mongoose";
import { ObjectId } from "bson";
export default mongoose.model('Register',
    new Schema({
    id:{type: ObjectId},
    idThesis:{
        type: String,
    },
    member:[{ 
        id: String,
        name: String,
        class: String,
        major: String
    }],
    status : {
        type: String
    }

},{
        autoCreate: false,
        autoIndex: true
    })
)