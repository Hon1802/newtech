import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs'
import {
    handleAddThesis
} from "../../services/thesisService.js"
import {
    handleAddReference,
    handleGetAllReference,
    getById
} from "../../services/referenceService.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import multer from "multer";

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
        let author = req.body.author;
        if(author)
        { 
            author = JSON.parse(author); 
        }  
        let member = req.body.member;
        if(member)
        { 
            member = JSON.parse(member);
        } 
        let instructor = req.body.instructor; 
        if(instructor)
        {
            instructor = JSON.parse(instructor);
        }
        let type = req.body.type;
        let result = req.body.result;
        let reference = req.body.reference;
        if(reference)
        { 
            reference = JSON.parse(reference); 
        }  
        let status = req.body.status; 
        if (!title || !description ||  
            !industry || !academic_year || 
            !time_start || !time_end || !author || !instructor || !type){
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
                                            author,
                                            member,
                                            instructor,
                                            type,
                                            result,
                                            reference,
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