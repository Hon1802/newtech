import { MAJOR } from "../../global/constants.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import multer from "multer";
import validator from 'validator';
import {
    checkExist,
    handleAddAccount,
    handleGetAllUser,
    handleDeleteAccount,
    handleGetAnnouncement,
    handleUploadAnnouncement,
    handleGetAnnouncementById,
} from '../../services/userService.js'
import {
    handleDeleteThesis,
    handleUpdateThesisById
} from '../../services/thesisService.js'
export const getMajor = async(req, res) =>{
    try {
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: MAJOR
        }) 
    } catch(e)
    {
        console.log(e)
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const getAllUser = async(req, res) =>{
    try {
        let userData = await handleGetAllUser();

        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: userData
        }) 
    } catch(e)
    {
        console.log(e)
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const addAccount = async(req, res) =>{
    try {
        let fullName = req.body.fullName;
        let idUser = req.body.idUser;
        let email = req.body.email;
        let role = req.body.role;
        let gender = req.body.gender;
        let major = req.body.major;
        if(!fullName|| !idUser || !email || !role || !major || !gender)
        {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input, check again'
            }) 
        }
        if( await checkExist(email, 'email'))
        {
            return res.status(400).json({
                errCode: 1,
                message: 'User is already exist',
            }) 
        } else{
            let userData = await handleAddAccount(idUser, 
                                                fullName, 
                                                email, 
                                                major,
                                                gender,
                                                role)
            
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage
            }) 
        }
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const deleteAccount = async(req, res) =>{
    try {
        let idAccount = req.body.idAccount;
        if(!idAccount)
        {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input, check again'
            }) 
        }
        let userData = await handleDeleteAccount(idAccount);
        
        return res.status(userData.status).json({
            errCode: userData.errCode,
            message: userData.errMessage
        }) 
        
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const addAnnouncementAccount = async(req, res) =>{
    try{
        upload.single('image')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    errCode: 400,
                    message: "Error uploading image.",
                });
            }
           
            let pathName = req.file.filename;
            let author = req.body.author;
            let description = req.body.description;
            let title = req.body.title;
            let pathFile = 'src/public/announcement/' + pathName;
            let userData = await handleUploadAnnouncement(
                                                        title,       
                                                        description,
                                                        author,
                                                        pathFile, 
                                                        );

            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                userData
            }) 
        }); 
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    } 
}
export const getAnnouncement = async(req, res) =>{
    try {
        let userData = await handleGetAnnouncement();
        try {
            let dataDo = userData.data;
            dataDo.forEach(item => {
                let pathImage = item.imageUrl;
                if(pathImage)
                {
                    item.imageUrl = fs.readFileSync(pathImage, {encoding: 'base64'});
                }
            });
        }catch{
            return res.status(400).json({
                errCode: 1,
                message: 'Error when send',
            }) 
        }
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: userData
        }) 
    } catch(e)
    {
        console.log(e)
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const getAnnouncementById = async(req, res) =>{
    try {
        let id = req.body.id;
        let userData = await handleGetAnnouncementById(id);
        let pathImage = userData.data.imageUrl;
        try{
            userData.data.imageUrl = fs.readFileSync(pathImage, {encoding: 'base64'});
        } catch{
            userData.data.imageUrl = 'no-image';
        }
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: userData
        }) 
    } catch(e)
    {
        console.log(e)
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
// update information by id
export const updateThesisById = async (req, res) => {
    try {
        let thesisId = req.body.id;
        let title = req.body.title;
        let description = req.body.description;
        // let dob = req.body.dob;
        let userData = await handleUpdateThesisById(
                           thesisId,
                           title, 
                           description);
        return res.status(userData.status).json({
            errCode: userData.errCode,
            message: userData.message,
            userData
        }) 
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const removeThesisById = async(req, res) =>{
    try {
        let idThesis = req.body.id;
        if(!idThesis)
        {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input, check again'
            }) 
        }
        let userData = await handleDeleteThesis(idThesis);
        
        return res.status(userData.status).json({
            errCode: userData.errCode,
            message: userData.errMessage
        }) 
        
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

//function for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/announcement');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
export const upload = multer({ storage });
