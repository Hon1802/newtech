import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs'
import {
    handleAddThesis,
    handleGetAllThesisNotCompleted,
    getThesisById,
    addMember,
    addSequence,
    checkUserThesis,
    getFileById,
    handleGetAllThesis,
    handleBrowseThesis,
    handleGetBrowseThesis,
    handleGetRegisterThesis,
    handleBrowseRegisterThesis,
    
} from "../../services/thesisService.js"
import {
    handleAddReference,
    handleGetAllReference,
    getById
} from "../../services/referenceService.js"
import {
    getInformation,
} from "../customers/userController.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import multer from "multer";

// get all thesis
// get all reference
export const getAllThesisNotCompleted = async(req, res) =>{
    try {
        let title = req.body.title ;
        let industry = req.body.industry ;
        let academic_year = req.body.academic_year ;
        let type = req.body.type ;     
        let status = req.body.status;   
        if(!status)
        {
            status = 1;
        }
        let referenceData = await handleGetAllThesisNotCompleted(
                                                        title,
                                                        industry,
                                                        academic_year,
                                                        type,
                                                        status);
                                                        
        let tempImagePaths = 'src/public/default/pdf.png';
        referenceData.image = fs.readFileSync(tempImagePaths, {encoding: 'base64'});
        return res.status(referenceData.status).json({
            errCode: referenceData.errCode,
            message: referenceData.message,
            referenceData
        }) 
        
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

// add new thesis
export const handleAddNewThesis = async(req, res) =>{
    try {
        let title = req.body. title;
        let code = req.body.code;
        let industry = req.body.industry;
        let description = req.body.description;
        let academic_year = req.body.academic_year;
        let time_start = req.body.time_start;
        let time_end = req.body.time_end;
        let instructor = req.body.instructor; 
        if(instructor)
        {
            instructor = JSON.parse(instructor);
        }
        let type = req.body.type;
        let status = req.body.status; 
        if (!title || !description ||  
            !industry || !academic_year || 
            !time_start || !time_end || !type || !instructor){
            return res.status(400).json({
                errCode: 1,
                message:"Missing inputs value"
            }) 
        }
        if(!status)
        { 
            status = '1';
        }

        try{
            let thesisData = await handleAddThesis(title,
                                            code,
                                            industry,
                                            description,
                                            academic_year,
                                            time_start,
                                            time_end,
                                            instructor,
                                            type,
                                            status);
 
            return res.status(thesisData.status).json({
                errCode: thesisData.errCode,
                message: thesisData.errMessage,
                thesisData
            }) 
        } catch(e)
        {
            return res.status(400).json({
                errCode: 1,
                message: 'Error from database',
            }) 
        }
        
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Data input invalid',
        }) 
    }
}
//add new file pdf
export const uploadReference = async (req,res) =>{
    try{
        upload.single('thesis')(req, res, async function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    errCode: 400,
                    message: "Error uploading thesis.",
                });
            }
           
            let pathName = req.file.filename;
            let title = req.body.title;
            let industry = req.body.industry;
            let description = req.body.description;
            let academic_year = req.body.academic_year;
            let type = req.body.type;
            let result = req.body.result;
            let pathFile = 'src/public/thesis/' + pathName;
            let thesisData = await handleAddReference(
                                title,
                                industry,
                                description,
                                academic_year,
                                type,
                                result,
                                pathFile); 
            // console.log(pathFile);
            return res.status(thesisData.status).json({
                errCode: thesisData.errCode,
                message: thesisData.errMessage,
                thesisData                 
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
// get all reference
export const getReference = async(req, res) =>{
    try {
        let title = req.body.title ;
        let industry = req.body.industry ;
        let academic_year = req.body.academic_year ;
        let type = req.body.type ;
        
        let referenceData = await handleGetAllReference(title,
                                                        industry,
                                                        academic_year,
                                                        type);
        let tempImagePaths = 'src/public/default/pdf.png';
        referenceData.image = fs.readFileSync(tempImagePaths, {encoding: 'base64'});
        
        return res.status(referenceData.status).json({
            errCode: referenceData.errCode,
            message: referenceData.message,
            referenceData
        }) 
        
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
// register Thesis
export const registerThesis = async(req, res) =>{
    try {
        let idThesis = req.body.idThesis;
        let idMember = req.body.idMember || '000000';
        let member = await getInformation(idMember);
        // console.log(member);
        if(idThesis)
        {
            let dataThesis = await getThesisInformation(idThesis);
            let typeThesis = dataThesis.data.type;
            if( ! await checkUserThesis(member, typeThesis))
            {
                return res.status(400).json({
                    errCode: 1,
                    message: 'Students who have registered for this type of thesis before, please register for another thesis ',
                }) 
            }
            let checkMatch = true; 
            for (let i = 0; i < dataThesis.data.member.length; i++) {
                if (dataThesis.data.member[i].name === member[0].name) {
                    checkMatch = false;
                    break; 
                }
            } 
            if(checkMatch)
            {
                if(dataThesis.data.N_member === 0)
                {
                    let thesisData = await addMember(idThesis, member);
                    return res.status(200).json({
                        errCode: 0,
                        message: 'Success',
                    }) 
                } 
                if(dataThesis.data.N_member === 1)
                {
                    let thesisData = await addSequence(idThesis, member);
                    return res.status(thesisData.status).json({
                        errCode: thesisData.errCode,
                        message: thesisData.errMessage,
                    }) 
                } 
                if(dataThesis.data.N_member === 2)
                {
                    return res.status(400).json({
                        errCode: 0,
                        message: 'Out of slot, please register another topic',
                    }) 
                } 
            } else {
                return res.status(400).json({
                    errCode: 1,
                    message: 'Students already exist in this thesis',
                }) 
            }
        }
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Invalid input value or input value not exist',
        }) 
    }
}
// read pdf
export const readPdf = async(req, res) =>{
    try {
        let idFile = req.body.idFile;
        let PDFData = await getById(idFile);
        if(PDFData.errCode === 0)
        {
            console.log(PDFData);
            let pathPDF = PDFData.data.urlSave;
            var data =fs.readFileSync(pathPDF);
                res.contentType("application/pdf");
                res.send(data);
        } else{
            return res.status(PDFData.status).json({
                errCode: PDFData.errCode,
                message: PDFData.message
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
// read pdf
export const readTask = async(req, res) =>{
    try {
        let idFile = req.body.idFile;
        let PDFData = await getFileById(idFile);
        if(PDFData.errCode === 0)
        {
            let pathPDF = PDFData.data;
            var data =fs.readFileSync(pathPDF);
                res.contentType("application/pdf");
                res.send(data);
        } else{
            return res.status(PDFData.status).json({
                errCode: PDFData.errCode,
                message: PDFData.message
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

//function for thesis
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/thesis');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
export const upload = multer({ storage });
// browseTask
export const browseThesis = async(req, res) =>{
    try {
        let idRequest = req.body.idRequest;
        let browse = req.body.browse;
        let dataResponse = await handleBrowseThesis(idRequest, browse);
        return res.status(dataResponse.status).json({
            errCode: dataResponse.errCode,
            message: dataResponse.message,
            dataResponse
        }) 
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const getBrowseThesis = async(req, res) =>{
    try {
        let dataResponse = await handleGetBrowseThesis();
        return res.status(dataResponse.status).json({
            errCode: dataResponse.errCode,
            message: dataResponse.message,
            dataResponse
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
export const getAllThesis = async(req, res) =>{
    try {
        let dataResponse = await handleGetAllThesis();
        return res.status(dataResponse.status).json({
            errCode: dataResponse.errCode,
            message: dataResponse.message,
            dataResponse
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
export const getRegisterThesis = async(req, res) =>{
    try {
        let idThesis = req.body.idThesis;
        let dataResponse = await handleGetRegisterThesis(idThesis);
        return res.status(dataResponse.status).json({
            errCode: dataResponse.errCode,
            message: dataResponse.message,
            dataResponse
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
export const browseRegisterThesis = async(req, res) =>{
    try {
        let idThesis = req.body.idRegister;
        let browse =req.body.browse;
        let dataResponse = await handleBrowseRegisterThesis(idThesis, browse);
        return res.status(dataResponse.status).json({
            errCode: dataResponse.errCode,
            message: dataResponse.message,
            dataResponse
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
// add new thesis
export const example = async(req, res) =>{
    try {

    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

// get user by user id
export const getThesisInformation = async (thesisId) => {
    try{
        let thesisData = await getThesisById(thesisId);    
        return thesisData;
    } catch(e)
    {
        let modifiedData =[];   
        return modifiedData;
    }
}