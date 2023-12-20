import { Thesis, Register } from "../models/index.js"
import { checkExist } from "./userService.js";
import { ObjectId } from 'mongodb';
import path from 'path'

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
                                status = 2) =>{
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
                        status : 2,
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
            let thesisResult = transformedResultsThe;
            if(status)
            {
                thesisResult = transformedResultsThe.filter(thesis => {
                    return (thesis.status == status);
                });  
            } 
            const combinedResult = thesisResult;
            combinedResult.forEach(item=>{
                // console.log(item.tasks)
                let fileTask = item.tasks;
                let fn = '';
                fileTask.forEach(nameFile=>{
                    console.log(nameFile.result)
                    fn = path.basename(nameFile.result).replace(/^[^-]+-/, '').trim();
                    try{
                        let parts = fn.split('-');
                        let modifiedString = parts.slice(1).join('-');
                        nameFile.result = modifiedString;
                    } catch(e)
                    {

                    }
                });
            });
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
// get task result by id
export const getFileById = (fileId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let pdfData = {};
            let isExist = await Thesis.findOne({'tasks._id': fileId }).exec();    
            if(isExist)
            {   
                let taskGet = isExist.tasks;
                const fileIdObj = new ObjectId(fileId);
                taskGet.forEach(result => {
                    if(result._id.equals(fileIdObj))
                    {
                        pdfData.errCode = 0;
                        pdfData.errMessage ='Get thesis by id success';
                        pdfData.data = result.result;
                        pdfData.status = 200;
                        resolve(pdfData)
                    }
                });
                
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
            let pdfData = 0;
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
                    resolve(pdfData);
                }
                pdfData = 1;
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
//
export const handelCancelThesis = (thesisId, idUser) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            const thesisCheck = await Thesis.findOne({ _id: thesisId, 'member.id': idUser});
            console.log(thesisCheck)
            if(thesisCheck){
                const thesis = await Thesis.updateOne(
                    { _id: thesisId}, 
                    {   
                        $pull:
                        { 
                            member : {
                                id: idUser
                            }
                        },
                        $inc: { N_member: -1}
                    }
                  );
                if (thesis.nModified === 0) {
                // If no document was modified
                    taskData.errCode = 1;
                    taskData.errMessage = 'No student found or remove';
                    taskData.status = 400;
                    resolve(taskData);
                } else {
                // If the update was successful
                    taskData.errCode = 0;
                    taskData.errMessage = 'Student removed successfully';
                    taskData.status = 200;
                    resolve(taskData);
                }
            }else{
                let pdfData = {};
                pdfData.errCode = 1;
                pdfData.errMessage ='No student map';
                pdfData.status = 400;
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
export const getTaskThesis = (studentId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            let allTasks = [];
            const thesisCheck = await Thesis.find({'member.id':studentId});
            if (thesisCheck) {
                thesisCheck.forEach(result => {
                    // allTasks = allTasks.concat(result.tasks);
                    let fileTask = result.tasks;
                    let fn = '';
                    fileTask.forEach(nameFile=>{
                        fn = path.basename(nameFile.result).replace(/^[^-]+-/, '').trim();
                        try{
                            let parts = fn.split('-');
                            let modifiedString = parts.slice(1).join('-');
                            nameFile.result = modifiedString;
                        } catch(e)
                        {

                        }
                    });
                    allTasks = allTasks.concat(result);
                });
                taskData.data = allTasks;
                taskData.errCode = 0;
                taskData.errMessage = 'Document get successfully ';
                taskData.status = 200;
                resolve(taskData);
            } else {
            // If the update was successful
                taskData.errCode = 1;
                taskData.errMessage = 'No document found';
                taskData.status = 400;
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
export const handleGetAllThesis = (studentId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            let allTasks = [];
            const thesisCheck = await Thesis.find({'member.id':studentId});
            if (thesisCheck) {
                thesisCheck.forEach(result => {
                    // allTasks = allTasks.concat(result.tasks);
                    let fileTask = result.tasks;
                    let fn = '';
                    fileTask.forEach(nameFile=>{
                        fn = path.basename(nameFile.result).replace(/^[^-]+-/, '').trim();
                        try{
                            let parts = fn.split('-');
                            let modifiedString = parts.slice(1).join('-');
                            nameFile.result = modifiedString;
                        } catch(e)
                        {

                        }
                    });
                    allTasks = allTasks.concat(result);
                });
                taskData.data = allTasks;
                taskData.errCode = 0;
                taskData.errMessage = 'Document get successfully ';
                taskData.status = 200;
                resolve(taskData);
            } else {
            // If the update was successful
                taskData.errCode = 1;
                taskData.errMessage = 'No document found';
                taskData.status = 400;
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
export const handleBrowseThesis = (thesisId, browse) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let taskData = {};
            let thesisCheck = {};
            if(browse === 'accept')
            {
                thesisCheck = await Thesis.updateOne(
                    { _id: thesisId }, 
                    { $set: { 
                        status: 1,
                     } } 
                  );
            } else{
                thesisCheck = await Thesis.deleteOne({ _id: thesisId });
            }
            if (thesisCheck.nModified === 0) {
                taskData.status = 400;
                taskData.errCode = 4;
                taskData.errMessage = 'Thesis deleted or not found';
                resolve(taskData);
            } else{
                taskData.status = 200;
                taskData.errCode = 0;
                taskData.errMessage = 'Thesis done';
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
export const handleGetBrowseThesis = () =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let pdfData = {};
            let isExist = await Thesis.find({status: '2' }).exec();    
            if(isExist)
            {   
                pdfData.errCode = 0;
                pdfData.errMessage ='Get thesis by id success';
                pdfData.data = isExist;
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
export const handleGetRegisterThesis = (idThesis) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let pdfData = {};
            let isExist = await Register.find({idThesis: idThesis}).exec();    
            if(isExist)
            {   
                pdfData.errCode = 0;
                pdfData.errMessage ='Get thesis by id success';
                pdfData.data = isExist;
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
export const handleBrowseRegisterThesis = (idThesis, browse) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let pdfData = {};
            let isExist = await Register.findOne({_id: idThesis}).exec();    
            if(isExist && browse ==="accept")
            {   
                let member = isExist.member;
                let idTh = isExist.idThesis;

                let addN = await addMember (idTh, member);
                if(addN === '1')
                {
                    pdfData.errCode = 1;
                    pdfData.errMessage ='Error invalid input';
                    pdfData.data = isExist;
                    pdfData.status = 400;
                    resolve(pdfData)
                } else {
                    let deleteRe = await Register.deleteOne({_id: idThesis});
                    pdfData.errCode = 0;
                    pdfData.errMessage ='Success';
                    pdfData.data = isExist;
                    pdfData.status = 200;
                    resolve(pdfData)
                    
                }
            }else{
                let deleteRe = await Register.deleteOne({_id: idThesis});
                pdfData.status = 200;
                pdfData.errCode = 3;
                pdfData.errMessage ='Cancel success'
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

export const handleUpdateThesisById = (
                                    thesisId,
                                    title, 
                                    description) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExit = await Thesis.findOne({_id:thesisId}).exec();
            if(isExit)
            {
                const thesis = await Thesis.updateOne(
                    { _id: thesisId }, // Filter: Find the user with the given id
                    { $set: { 
                        title : title,
                        description: description
                     } } 
                  );
                if (thesis.nModified === 0) {
                // If no user was modified, it means the user with the given id was not found
                    userData.status = 400;
                    userData.errCode = 4;
                    userData.errMessage = 'Thesis not found';
                    resolve(userData);
                }
                userData.status = 200;
                userData.errCode = 0; // Assuming 0 means success
                userData.errMessage = 'Uploaded successfully';
                resolve(userData);
            } else{
                userData.status = 400;
                userData.errCode = 0; // Assuming 0 means success
                userData.errMessage = 'Your Thesis was not created !!!';
                resolve(userData);
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your Thesis was not created'             
            resolve(userData)
        }
        })
};
// Delete account
export const handleDeleteThesis = (idThesis) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await Thesis.findOne({_id: idThesis}).exec();            
            if(isExist)
            {   
                let del = await Thesis.deleteOne({_id: idThesis}).exec();
                userData.status = 200;
                userData.errCode = 0;
                userData.errMessage = 'Deleted success';
                resolve(userData)

            }else{
                userData.status = 400;
                userData.errCode = 4;
                userData.errMessage = 'Thesis not exist'  ;
                resolve(userData)
            }
        }catch(e){
            let userData = {};
            userData.status = 400;
            userData.errCode = 3;
            userData.errMessage ='Your thesis was not created'             
            resolve(userData)
        }
    })
};