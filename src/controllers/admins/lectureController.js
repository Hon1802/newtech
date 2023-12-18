import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs'
import {
    addTaskThesis,
    removeTaskThesis,
    submitTaskThesis,
    evaluateTaskThesis,
    getTaskThesis
} from "../../services/thesisService.js"
import {
    getInformation,
} from "../customers/userController.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import multer from "multer";

// add new thesis
export const createTask = async(req, res) =>{
    try {
        let task = req.body.task;
        let time = req.body.time;
        let id = req.body.idThesis;
        let description = req.body.description;
        let dataTask = '[{ "task" : " '+ task + '", "description" : " '+ description + '", "time" : "'+ time + '", "evaluate":"none", "result":"none", "process":"none", "status":"1"}]';
        if(dataTask)
        {
            dataTask = JSON.parse(dataTask);
        }
        let taskData = await addTaskThesis(id, dataTask);
        return res.status(taskData.status).json({
            errCode: taskData.errCode,
            message: taskData.errMessage,
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
export const removeTask = async(req, res) =>{
    try {
        let idTask = req.body.taskId;
        let id = req.body.idThesis;
        
        let taskData = await removeTaskThesis(id, idTask);
        return res.status(taskData.status).json({
            errCode: taskData.errCode,
            message: taskData.errMessage,
        }) 
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

//add new file pdf
export const submitTask = async (req,res) =>{
    try{
        upload.single('submit')(req, res, async function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    errCode: 400,
                    message: "Error uploading thesis.",
                });
            }
            let pathName = req.file.filename;
            let progress = req.body.progress;
            let id = req.body.idUser;
            let idTask = req.body.idTask;
            if(!progress)
            {
                progress = 'null';
            }
            let student = await getInformation(id);
            let pathFile = 'src/public/tasks/' + pathName;
            // // console.log(pathFile);
            let thesisData = await submitTaskThesis(
                                idTask, 
                                pathFile, 
                                progress, 
                                student); 
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

//add new file pdf
export const evaluateTask = async (req,res) =>{
    try{
        let evaluate = req.body.evaluate;
        let idTask = req.body.idTask;

        // // console.log(pathFile);
        let thesisData = await evaluateTaskThesis(
                            idTask, 
                            evaluate); 
        // console.log(pathFile);
        return res.status(thesisData.status).json({
            errCode: thesisData.errCode,
            message: thesisData.errMessage,
            thesisData                 
        }) 
    } catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
//add new file pdf
export const getTask = async (req,res) =>{
    try{
        let idStudent= req.body.idStudent;
        // // console.log(pathFile);
        let thesisData = await getTaskThesis(idStudent); 
        // console.log(pathFile);
        return res.status(thesisData.status).json({
            errCode: thesisData.errCode,
            message: thesisData.errMessage,
            thesisData                 
        }) 
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
      cb(null, './src/public/tasks');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
export const upload = multer({ storage });
