import { MAJOR } from "../../global/constants.js";
import {
    handleAddAccount,
    checkExist,
    handleGetAllUser,
    handleDeleteAccount
} from '../../services/userService.js'
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
        let major = req.body.major;
        if(!fullName|| !idUser || !email || !role || !major)
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