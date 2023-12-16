import { ObjectId } from "bson";
import mongoose, { Schema } from "mongoose";

import validator from 'validator';
export default mongoose.model('User',
    new Schema({
        id:{type: ObjectId},
        idGoogle:{
            type: String
        },
        idUser:{
            type: String,
            require : true
        },
        name:{
            type:String,
            required:true,
            validate:{
                validator:(value) =>value.length>3,
                message:'User name must at least 3 characters'
            }
        },
        dob:{
            type: Date,
        },
        email:{
            type: String,
            validate:{
                validator:(value) => validator.isEmail(value),
                message:'Email is incorrect format'
            }
        },
        phoneNumber:{
            type:String,
            required:true,
            validate:{
                validator:(phoneNumber) => phoneNumber.length>5,
                message:'Email is incorrect format'
            }        
        },
        major:{
            type:String,
            required:true        
        },
        role:{
            type:String,
            required:true        
        },
        stClass:{
            type:String,     
        },
        facility:{
            type:String,     
        },
        gender:{
            type:String,
            enum:{
                values:['Male','Female'],
                message:'{VALUE} is not supported'
            }
        },
        urlAvatar:{
            type:String
        },
        token:{
            type:String       
        },
        status:{
            type:String,
            required:true        
        }     
    },{
        autoCreate: false,
        autoIndex: true
    })
) 