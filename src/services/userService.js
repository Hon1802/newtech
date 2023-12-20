import { resolve } from "path";
import { User, Announcement } from "../models/index.js"
import { rejects } from "assert";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { salt_rounds , jwt_secret} from "../config/main.js";
// check login
export const handleUserLogin = (email, userData = {}) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let isExist = await User.findOne({email}).exec();
            if(isExist && isExist.status == 1)
            {   
                //create java web token
                // use for user use web, if you have token you will have role to do st, if you have't you can't do it, and login and register need't token
                let token = jwt.sign({
                    data : {
                        _id : isExist._id,
                        name : isExist.name,
                        email : isExist.email
                    }
                    }, 
                    jwt_secret,
                    {
                        expiresIn: '30 days' // 30 day
                    }
                )
                let saveTo = await saveToken(isExist._id, token);
                userData.status = 200;
                userData.errCode = 0;
                userData.errMessage ='you can get access token';
                userData.data = {
                    ...isExist.toObject(),
                    password:'Not show',
                    token: token
                }
                resolve(userData)
            }else{
                userData.status = 400;
                userData.errCode = 2;
                userData.errMessage ='Your account not exist'
                resolve(userData)
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Error connect'
            resolve(userData)
        }
    })
};
// check out
export const handleUserLogOut = (userId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            const user = await User.updateOne(
                { _id: userId }, // Filter: Find the user with the given id
                { 
                    $set: { 
                        token: 'expired'
                    }                     
                } // Update
              );
            //create java web token
            // use for user use web, if you have token you will have role to do st, if you have't you can't do it, and login and register need't token
            // let destroyToken = jwt.destroy(token)
            userData.status =200;
            userData.errCode = 0;
            userData.errMessage ='Logout success';
            resolve(userData)
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 1;
            userData.errMessage ='Not connect';
            resolve(userData)
        }
    })
};
// register
export const handleAddAccount = (
                                idUser,
                                fullName, 
                                email,
                                major,
                                gender,
                                role) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({email}).exec();            
            if(isExist)
            {   
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage = 'Email exists';
                resolve(userData)

            }else{
                try {
                    const newUser = await User.create({
                        idUser: idUser,
                        name:fullName, 
                        email: email,
                        phoneNumber: '00000000',
                        major: major,
                        gender: gender,
                        role: role,
                        token: 'expired',
                        status : '1'
                    })
                    userData.status = 200;
                    userData.errCode = 0;
                    userData.errMessage ='Your account was create';
                    userData.data = {
                        ...newUser._doc,
                        password: 'Not show'
                    }
                    console.log('success')
                    resolve(userData)
                } catch(e){
                    
                    userData.status = 400;
                    userData.errCode = 4;
                    userData.errMessage = 'Unprocessable Entity'  ;
                    resolve(userData)
                }  
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            resolve(userData)
        }
    })
};
export const handleAddUser = (
                                idUser,
                                fullName, 
                                dob, 
                                email,
                                phone,
                                major,
                                role,
                                stClass,
                                facility,
                                gender, 
                                urlAvatar,
                                token,
                                status = 1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({email}).exec();            
            if(isExist)
            {   
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage = 'Email exists';
                resolve(userData)

            }else{
                try {
                    const newUser = await User.create({
                        idUser: idUser,
                        name:fullName, 
                        Dob: dob, 
                        email: email,
                        phoneNumber: phone,
                        major: major,
                        role: role,
                        stClass: stClass,
                        facility: facility,
                        gender: gender, 
                        urlAvatar: urlAvatar,
                        token: token,
                        status : status
                    })
                    userData.status = 200;
                    userData.errCode = 0;
                    userData.errMessage ='Your account was create';
                    userData.data = {
                        ...newUser._doc,
                        password: 'Not show'
                    }
                    console.log('success')
                    resolve(userData)
                } catch(e){
                    
                    userData.status = 400;
                    userData.errCode = 4;
                    userData.errMessage = 'Unprocessable Entity'  ;
                    resolve(userData)
                }  
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            resolve(userData)
        }
    })
};
// Delete account
export const handleDeleteAccount = (idAccount) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({_id: idAccount}).exec();            
            if(isExist)
            {   
                let del = await User.deleteOne({_id: idAccount}).exec();
                userData.status = 200;
                userData.errCode = 0;
                userData.errMessage = 'Deleted success';
                resolve(userData)

            }else{
                userData.status = 400;
                userData.errCode = 4;
                userData.errMessage = 'Account not exist'  ;
                resolve(userData)
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            resolve(userData)
        }
    })
};
//upload avatar to mongo
export const uploadAvatar = (path, idUser) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            
            const user = await User.updateOne(
                { _id: idUser }, // Filter: Find the user with the given id
                { $set: { urlAvatar: path } } // Update: Set the urlAvatar field to the new path
              );
            if (user.nModified === 0) {
            // If no user was modified, it means the user with the given id was not found
                userData.errCode = 4;
                userData.status = 400;
                userData.errMessage = 'User not found';
                resolve(userData);
            }
            userData.status = 200;
            userData.errCode = 0; // Assuming 0 means success
            userData.errMessage = 'Avatar uploaded successfully';
            resolve(userData);
        }catch(e){   
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Error uploading avatar'             
            rejects(userData)
        }
    })
};
//get by id
export const getById = (userId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let userData = {};
            let isExist = await User.findOne({_id: userId }).exec()        
            if(isExist)
            {   
                userData.errCode = 2;
                userData.errMessage ='Get user by id success';
                userData.data = {
                    ...isExist.toObject(),
                    password:'Not show'    
                };
                userData.status = 200;
                resolve(userData)
            }else{
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage ='Error connect'
                resolve(userData) 
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'         
            rejects(userData)
        }
    })
};
//get by id
export const handleGetAllUser = () =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let userData = {};
            let isExist = await User.find().exec()        
            if(isExist)
            {   
                userData.errCode = 2;
                userData.errMessage ='Get user success';
                userData.data = isExist;
                userData.status = 200;
                resolve(userData)
            }else{
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage ='Error connect'
                resolve(userData) 
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'         
            rejects(userData)
        }
    })
};
//get by id
export const getByUserId = (userId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let userData = {};
            let isExist = await User.findOne({ idUser: userId }).exec()        
            if(isExist)
            {   
                userData.errCode = 2;
                userData.errMessage ='Get user by id success';
                userData.data = {
                    ...isExist.toObject(),
                    password:'Not show'    
                };
                userData.status = 200;
                resolve(userData)
            }else{
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage ='Error connect'
                resolve(userData) 
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'         
            rejects(userData)
        }
    })
};
//update by id
export const updateById = (userId, 
                            fullName, 
                            phone,
                            major,
                            stClass,
                            facility,
                            role,
                            gender ) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            const user = await User.updateOne(
                { _id: userId }, // Filter: Find the user with the given id
                { $set: { 
                    name : fullName,
                    phoneNumber: phone,
                    major: major,
                    stClass: stClass,
                    facility: facility,
                    role: role,
                    gender: gender
                 } } // Update: Set the urlAvatar field to the new path
              );
            if (user.nModified === 0) {
            // If no user was modified, it means the user with the given id was not found
                userData.status = 400;
                userData.errCode = 4;
                userData.errMessage = 'User not found';
                resolve(userData);
            }
            userData.status = 200;
            userData.errCode = 0; // Assuming 0 means success
            userData.errMessage = 'Uploaded successfully';
            resolve(userData);
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            resolve(userData)
        }
    })
};
//update password
export const changeStatusUser = (userId, password) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({_id: userId }).exec();
            if(isExist)
            {   
                //check password compare with password encrypt     
                let isMatch = await bcrypt.compare(password,isExist.password)
                if(!!isMatch){
                    
                    const user = await User.updateOne(
                        { _id: userId }, // Filter: Find the user with the given id
                        { $set: { 
                           status: 0
                         } } // Update: new pass
                      );
                    userData.status = 200;
                    userData.errCode = 0;
                    userData.errMessage = 'Success';
                    resolve(userData);
                } else {
                    userData.status = 400;
                    userData.errCode = 2;
                    userData.errMessage ='Wrong password'
                    resolve(userData)
                }
                resolve()
            }else{
                userData.status = 400;
                userData.errCode = 1;
                userData.errMessage ='Your account not exist'
                resolve(userData)
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Error connect'
            resolve(userData)
        }
    })
};
//function check id or email exist or no
export const checkExist = (text, types) =>{
    return new Promise( async (resolve, rejects)=>{
        let checks = false;
        try{
            if(types === 'id')
            {
                let isExist = await User.findOne({_id: text }).exec();
                if(isExist)
                {
                    checks = true;
                    resolve(checks);
                } else{
                    resolve(checks);
                }
            } else if (types === 'email')
            {
                let isExist = await User.findOne({email: text}).exec();  
                if(isExist)
                {
                    checks = true;
                    resolve(checks);
                } else{
                    resolve(checks);
                }
            } else if (types ==='idGG')
            {
                let isExist = await User.findOne({idGoogle: text}).exec(); 
                console.log(isExist);
                if(isExist)
                {
                    checks = true;
                    resolve(checks);
                } else{
                    resolve(checks);
                }
            }
        }catch(e){    
            checks = 0;          
            rejects(checks)
        }
    })
};
export const saveToken = (userId, token) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            const user = await User.updateOne(
                { _id: userId }, // Filter: Find the user with the given id
                { 
                    $set: { 
                        token: token
                    }                     
                } // Update
              );
            resolve({ success: true, message: 'Token saved successfully.' });
        }catch(e){        
            rejects({ success: false, error : e.message })
        }
    })
};
//check token
export const checkTokenExist = (token) =>{
    return new Promise( async (resolve, rejects)=>{
        let checks = false;
        try{            
            let isExist = await User.findOne({token: token}).exec();  
            if(isExist)
            {
                checks = true;
                resolve(checks);
            } else{
                resolve(checks);
            }            
        }catch(e){    
            checks = 0;          
            rejects(checks)
        }
    })
};
// register
export const handleUploadAnnouncement = (
                                title,
                                description, 
                                author,
                                imageUrl) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            const newAnnounce = await Announcement.create({
                title: title,
                description: description,
                author: author,
                time: Date.now(),
                imageUrl: imageUrl
            })
            userData.status = 200;
            userData.errCode = 0;
            userData.errMessage ='Your announcement was create';
            userData.data = {
                ...newAnnounce._doc
            }
            console.log('success')
            resolve(userData)
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your announcement was not created'             
            resolve(userData)
        }
    })
};
export const handleGetAnnouncement = () =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let userData = {};
            let isExist = await Announcement.find().sort({ time: -1 }).limit(5);       
            if(isExist)
            {   
                userData.errCode = 0;
                userData.errMessage ='Get user by id success';
                userData.data =isExist;
                userData.status = 200;
                resolve(userData)
            }else{
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage ='Error connect'
                resolve(userData) 
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='No announcement can get'         
            rejects(userData)
        }
    })
};
export const handleGetAnnouncementById = (id) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let userData = {};
            let isExist = await Announcement.findOne({_id: id}).exec();       
            if(isExist)
            {   
                userData.errCode = 0;
                userData.errMessage ='Get user by id success';
                userData.data ={
                    ...isExist.toObject()
                };
                userData.status = 200;
                resolve(userData)
            }else{
                userData.status = 400;
                userData.errCode = 3;
                userData.errMessage ='Error connect'
                resolve(userData) 
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='No announcement can get'         
            rejects(userData)
        }
    })
};