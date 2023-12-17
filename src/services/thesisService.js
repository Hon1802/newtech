import { Thesis, Register } from "../models/index.js"
import { checkExist } from "./userService.js";

// register
export const handleAddThesis = (
                                title,
                                code,
                                industry,
                                description,
                                academic_year,
                                time_start,
                                time_end,
                                instructor,
                                type,
                                status = 1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let thesisData = {};
            let isExist = await Thesis.findOne({code}).exec();            
            if(isExist)
            {   
                thesisData.status = 400;
                thesisData.errCode = 3;
                thesisData.errMessage = 'Thesis exists';
                resolve(thesisData)

            }else{
                try {
                    const newThesis = await Thesis.create({
                        title : title,
                        code : code,
                        industry: industry,
                        description: description,
                        academic_year : academic_year,
                        time_start : time_start,
                        time_end : time_end,
                        instructor : instructor, 
                        type : type,
                        N_member : 0,
                        status : status
                    })
                    thesisData.status = 200;
                    thesisData.errCode = 0;
                    thesisData.errMessage ='Add thesis success';
                    thesisData.data = {
                        ...newThesis._doc,
                    }
                    console.log('success')
                    resolve(thesisData)
                } catch(e){
                    
                    thesisData.status = 400;
                    thesisData.errCode = 4;
                    thesisData.errMessage = 'Unprocessable Entity'  ;
                    resolve(thesisData)
                }  
            } 
        }catch(e){
            let thesisData = {};
            thesisData.status = 400;
            thesisData.errCode = 3;
            thesisData.errMessage ='Your account was not created'             
            resolve(thesisData)
        }
    })
};

// get all reference
export const handleGetAllThesisNotCompleted = (title, 
                                                industry, 
                                                academic_year, 
                                                type, status) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let referenceData = {};
            let queryThesis = Thesis.find();  
            const filterConditions = {
                title: title && { $regex: new RegExp(title, 'i') },
                industry: industry && { $regex: new RegExp(industry, 'i') },
                academic_year: academic_year && { $regex: new RegExp(academic_year, 'i') },
                type: type && { $regex: new RegExp(type, 'i') }
              };
                       
            Object.keys(filterConditions).forEach(key => {
                if (filterConditions[key]) {
                    queryThesis = queryThesis.where(key, filterConditions[key]);
                }
            });
            let resultThesis = await queryThesis.exec();
            let resultsThesisArray = Array.isArray(resultThesis) ? resultThesis : [resultThesis];
            let transformedResultsThe = resultsThesisArray.map(item => item.toObject());
            let thesisResult = transformedResultsThe.filter(thesis => {
                return (thesis.status == status);
            });  
            const combinedResult = thesisResult;
            if(combinedResult)
            {   
                referenceData.status = 200;
                referenceData.errCode = 0;
                referenceData.errMessage ='Get thesis success';
                referenceData.data = combinedResult;
                resolve(referenceData)
            }else{
                referenceData.status = 400;
                referenceData.errCode = 3;
                referenceData.errMessage ='Error connect'
                resolve(referenceData) 
            }
        }catch(e){
            let referenceData = {};
            referenceData.status = 400;
            referenceData.errCode = 3;
            referenceData.errMessage ='No data'             
            resolve(referenceData)
        }
    })
};

// function for upload
// register
export const handleAddThesisData = (
                                title,
                                code,
                                industry,
                                description,
                                academic_year,
                                time_start,
                                time_end,
                                n_member,
                                member,
                                instructor,
                                type,
                                result,
                                status = 1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let thesisData = {};
            let isExist = await Thesis.findOne({code}).exec();            
            if(isExist)
                {   
                    thesisData.status = 400;
                    thesisData.errCode = 3;
                    thesisData.errMessage = 'Thesis exists';
                    resolve(thesisData)

                }else{
                    try {
                            const newThesis = await Thesis.create({
                                title : title,
                                code : code,
                                industry: industry,
                                description: description,
                                academic_year : academic_year,
                                time_start : time_start,
                                time_end : time_end,
                                N_member : n_member,
                                member : member,
                                instructor : instructor, 
                                type : type,
                                result: result,
                                status : status
                        })
                        thesisData.status = 200;
                        thesisData.errCode = 0;
                        thesisData.errMessage ='Add thesis success';
                        thesisData.data = {
                            ...newThesis._doc,
                        }
                        console.log('success')
                        resolve(thesisData)
                    } catch(e){

                        thesisData.status = 400;
                        thesisData.errCode = 4;
                        thesisData.errMessage = 'Unprocessable Entity'  ;
                        resolve(thesisData)
                        }  
                    } 
        }catch(e){
            let thesisData = {};
            thesisData.status = 400;
            thesisData.errCode = 3;
            thesisData.errMessage ='Your account was not created'             
            resolve(thesisData)
        }
    })
};

//
// get pdf by id
export const getThesisById = (fileId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let pdfData = {};
            let isExist = await Thesis.findOne({_id: fileId }).exec();    
            if(isExist)
            {   
                pdfData.errCode = 0;
                pdfData.errMessage ='Get thesis by id success';
                pdfData.data = {
                    ...isExist.toObject(),  
                };
                pdfData.status = 200;
                resolve(pdfData)
            }else{
                pdfData.status = 400;
                pdfData.errCode = 3;
                pdfData.errMessage ='Error connect'
                resolve(pdfData) 
            }
        }catch(e){
            let pdfData = {};
            pdfData.status = 400;
            pdfData.errCode = 3;
            pdfData.errMessage ='Not exist'         
            rejects(pdfData)
        }
    })
};

// add member
export const addMember = (thesisId, member) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let pdfData = {};
            {
                const thesis = await Thesis.updateOne(
                    { _id: thesisId, "member.name": { $ne: member[0].name }}, 
                    {   
                        $inc: { N_member: 1},
                        $push:
                        { 
                            member: member,
                        } }
                  );
                if (thesis.nModified === 0) {
                // If no user was modified, it means the user with the given id was not found
                    resolve(pdfData);
                }
            }
            resolve(pdfData);
        }catch(e){
            let pdfData = {};       
            rejects(pdfData)
        }
    })
};
//
export const addSequence = (thesisId, member) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let pdfData = {};
            const thesisCheck = await Register.find({ idThesis: thesisId});
            if(thesisCheck){
                let allMatch = true;
                thesisCheck.forEach(result => {
                    for (let i = 0; i < result.member.length; i++) {

                        if (result.member[i].name === member[0].name) {
                            allMatch = false;
                            break; 
                        }
                    }
                });
                if(allMatch) {
                    const newSequence = await Register.create({
                        idThesis: thesisId,
                        member: member,
                        status: 1
                    })
                    pdfData.errCode = 0;
                    pdfData.errMessage ='Awaiting approval';
                    pdfData.status = 200;
                    console.log(pdfData);
                    resolve(pdfData)
                } else{
                    pdfData.errCode = 1;
                    pdfData.errMessage ='One time each person register for each topic';
                    pdfData.status = 400;
                    resolve(pdfData)
                }
            }else{
                const newSequence = await Register.create({
                   idThesis: thesisId,
                   member: member,
                   status: 1,
                })
                pdfData.errCode = 0;
                pdfData.errMessage ='Awaiting approval';
                pdfData.status = 200;
                resolve(pdfData)
            }
            resolve(pdfData);
        }catch(e){
            let pdfData = {};   
            pdfData.errCode = 1;
            pdfData.errMessage ='try again';
            pdfData.status = 400;
            resolve(pdfData)    
        }
    })
};

//check user 
export const checkUserThesis = (member, typeThesis) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let pdfData = {};
                let allMatch = true;
                const thesisCheck = await Thesis.find({ 'member.name': member[0].name});
                thesisCheck.forEach(result => {
                    if(result.type === typeThesis)
                    {
                        allMatch = false;
                    }
                });
                resolve(allMatch);
        }catch(e){
            let allMatch = false;  
            resolve(allMatch)    
        }
    })
};
//
export const addTaskThesis = (thesisId, dataTask) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            const thesisCheck = await Thesis.find({ _id: thesisId});
            
            if(thesisCheck){
                const thesis = await Thesis.updateOne(
                    { _id: thesisId}, 
                    {   
                        $push:
                        { 
                            tasks : dataTask
                        } 
                    }
                  );
                if (thesis.nModified === 0) {
                // If no document was modified
                    taskData.errCode = 1;
                    taskData.errMessage = 'No document found or updated';
                    taskData.status = 400;
                    resolve(taskData);
                } else {
                // If the update was successful
                    taskData.errCode = 0;
                    taskData.errMessage = 'Document updated successfully';
                    taskData.status = 200;
                    resolve(taskData);
                }
            }else{
                taskData.errCode = 1;
                taskData.errMessage ='Check again, wrong not found thesis';
                taskData.status = 400;
                resolve(taskData)
            }
            resolve(taskData);
        }catch(e){
            let taskData = {};   
            taskData.errCode = 1;
            taskData.errMessage ='Invalid value input';
            taskData.status = 400;
            resolve(taskData)    
        }
    })
};
export const removeTaskThesis = (thesisId, idTask) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            const thesisCheck = await Thesis.find({ _id: thesisId});
            if(thesisCheck){
                const thesis = await Thesis.updateOne(
                    { _id: thesisId}, 
                    {   
                        $pull:
                        { 
                            tasks : {
                                _id: idTask
                            }
                        } 
                    }
                  );
                if (thesis.nModified === 0) {
                // If no document was modified
                    taskData.errCode = 1;
                    taskData.errMessage = 'No document found or remove';
                    taskData.status = 400;
                    resolve(taskData);
                } else {
                // If the update was successful
                    taskData.errCode = 0;
                    taskData.errMessage = 'Document removed successfully';
                    taskData.status = 200;
                    resolve(taskData);
                }
            }else{
                taskData.errCode = 1;
                taskData.errMessage ='Check again, wrong not found thesis';
                taskData.status = 400;
                resolve(taskData)
            }
            resolve(taskData);
        }catch(e){
            let taskData = {};   
            taskData.errCode = 1;
            taskData.errMessage ='Invalid value input';
            taskData.status = 400;
            resolve(taskData)    
        }
    })
};
export const submitTaskThesis = (taskId, 
                                dataTask, 
                                progress, 
                                student) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            // trans to yyyy-mm-dd
            // let currentDate = new Date(Date.now());
            //     currentDate.setUTCHours(0, 0, 0, 0);
            //     const formattedDate = currentDate.toISOString().split('T')[0];
            //     console.log(formattedDate);
            const thesis = await Thesis.updateOne(
                { 'tasks._id': taskId }, 
                { $set: 
                    {   
                        'tasks.$.idStudent': student[0].idUser,
                        'tasks.$.fullName': student[0].name,
                        'tasks.$.time': Date.now(),
                        'tasks.$.result': dataTask,
                        'tasks.$.progress': progress,
                        'tasks.$.status': '0',
                    } 
                }
                );
            if (thesis.nModified === 0) {
            // If no document was modified
                taskData.errCode = 1;
                taskData.errMessage = 'No document found or updated';
                taskData.status = 400;
                resolve(taskData);
            } else {
            // If the update was successful
                taskData.errCode = 0;
                taskData.errMessage = 'Document submit successfully';
                taskData.status = 200;
                resolve(taskData);
            }
        }catch(e){
            let taskData = {};   
            taskData.errCode = 1;
            taskData.errMessage ='Invalid value input';
            taskData.status = 400;
            resolve(taskData)    
        }
    })
};
export const evaluateTaskThesis = (taskId, 
                                evaluate) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            const thesis = await Thesis.updateOne(
                { 'tasks._id': taskId }, 
                { $set: 
                    {   
                        'tasks.$.evaluate': evaluate,
                    } 
                }
                );
            if (thesis.nModified === 0) {
            // If no document was modified
                taskData.errCode = 1;
                taskData.errMessage = 'No document found or evaluate';
                taskData.status = 400;
                resolve(taskData);
            } else {
            // If the update was successful
                taskData.errCode = 0;
                taskData.errMessage = 'Document evaluated successfully';
                taskData.status = 200;
                resolve(taskData);
            }
        }catch(e){
            let taskData = {};   
            taskData.errCode = 1;
            taskData.errMessage ='Invalid value input';
            taskData.status = 400;
            resolve(taskData)    
        }
    })
};