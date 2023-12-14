import {
    handleUserLogin,
    uploadAvatar, 
    checkExist,
    getById,
    updateById,
    changeStatusUser,
    handleUserLogOut
} from "../../services/userService.js" ;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import multer from "multer";
import validator from 'validator';
//login google
export const handleGGLogin = async (req,res) =>{
    if (req.user) {
        let idGG = req.user.emails[0].value;
        console.log(idGG);
        if(await checkExist(idGG, 'email'))
        {
            let userData = await handleUserLogin(idGG);
            return res.status(200).json({
                errCode: 0,
                message: "Successfully Loged In",
                userData
            }) 
        } else {
            return res.status(400).json({
                errCode: 1,
                message: "The account was't register, please contact with admin or try again",
                userData : "[{}]"
            }) 
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: "Not Authorized",
        }) 
       
    }
}
export const blackHandleGGLogin = async (req, res) =>{
    let email = req.body.email;
    if(!validator.isEmail(email))
    {
        return res.status(400).json({
            errCode: '1',
            message: 'invalid input value'
        }) 
    }
    if(await checkExist(email, 'email'))
    {
        let userData = await handleUserLogin(email);
        return res.status(userData.status).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            userData
        }) 
    } else {
        return res.status(400).json({
            errCode: '1',
            message: 'no user'
        }) 
        return userData = "[{}]";
    }

}
//register
export const handleRegister = async (req, res) =>{
    let fullName = req.body.fullName;
    let address = req.body.address;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let gender = req.body.gender;
    if (!email || !password){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    let userData = await handleUserRegister(fullName, address, email,password, phone, gender);

    return res.status(userData.status).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        userData
    }) 
}
//logout
export const handleLogOut = async (req, res) =>{
    let userId = req.body.id;
    console.log('ee')
    if (!userId){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    let userData = await handleUserLogOut(userId);
    return res.status(userData.status).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        // yourEmail: email
    }) 
}
//update avatar
export const updateAvatar = async (req, res) =>{
    try{
        upload.single('image')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    errCode: 400,
                    message: "Error uploading image.",
                });
            }
           
            let pathName = req.file.filename;
            let userId = req.body.id;
            let pathFile = 'src/public/imageUser/' + pathName;
            let userData = await uploadAvatar(pathFile, userId);

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
// get user by id
export const getUserById = async (req, res) => {
    try{
        let userId = req.body.id;
        if(await checkExist(userId, 'id'))
        {
            let userData = await getById(userId);
            let imagePath = userData.data.urlAvatar;
            if (imagePath == 'none' || imagePath == "no image") {
                imagePath = 'src/public/default/avatar.jpg';
            };
            let base64Image = '';
            fs.readFile(imagePath, async (err, data)  => {
                if (err) {
                  return res.status(400).send('Internal Server Error');
                }
                userData.status = 400;
                // Trans from image to Base64
                base64Image = data.toString('base64');
                if(userData.errCode == 2)
                {
                    userData = {
                        ...userData.data,
                        avatarBase64 : base64Image,
                    };
                    userData.status = 200;
                }
                return res.status(userData.status).json({
                    errCode: userData.errCode,
                    message: userData.message,
                    userData
                }) 
            });
            
        }
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
// update information by id
export const updateInfoById = async (req, res) => {
    try {
        let userId = req.body.id;
        let nameUser = req.body.nameUser;
        let address = req.body.address;
        let phone = req.body.phone;
        let gender = req.body.gender;
        let userData = await updateById(userId, nameUser, address, phone, gender);
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
//update new password
export const updateNewPassword = async (req, res) => {
    try {
        let userId = req.body.id;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        
        let userData = await updatePassword(userId, oldPassword, newPassword);
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
//update new password
export const deleteUserById = async (req, res) => {
    try {
        let userId = req.body.id;
        let password = req.body.password;
        let userData = await changeStatusUser(userId, password);
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
//function for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/imageUser');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
export const upload = multer({ storage });

