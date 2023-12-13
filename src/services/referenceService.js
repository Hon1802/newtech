import { Reference, Thesis } from "../models/index.js"

// register
export const handleAddReference = (
                                title,
                                industry,
                                description,
                                academic_year,
                                type,
                                result, 
                                pathFile) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let referenceData = {};            
            try {
                const newReference = await Reference.create({
                    title : title,
                    industry: industry,
                    description: description,
                    academic_year : academic_year,
                    type : type,
                    result: result,
                    urlSave: pathFile,
                })
                referenceData.status = 200;
                referenceData.errCode = 0;
                referenceData.errMessage ='Add reference success';
                referenceData.data = {
                    ...newReference._doc,
                }
                console.log('success')
                resolve(referenceData)
            } catch(e){
                console.log(e);
                referenceData.status = 400;
                referenceData.errCode = 4;
                referenceData.errMessage = 'Unprocessable Entity'  ;
                resolve(referenceData)
            }  
        }catch(e){
            let referenceData = {};
            referenceData.status = 400;
            referenceData.errCode = 3;
            referenceData.errMessage ='Your account was not created'             
            resolve(referenceData)
        }
    })
};
// get all reference
export const handleGetAllReference = (title, industry, academic_year, type) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let referenceData = {};
            let queryReference = Reference.find();
            let queryThesis = Thesis.find();           
            const filterConditions = {
                title: title && { $regex: new RegExp(title, 'i') },
                industry: industry && { $regex: new RegExp(industry, 'i') },
                academic_year: academic_year && { $regex: new RegExp(academic_year, 'i') },
                type: type && { $regex: new RegExp(type, 'i') }
              };
              
            Object.keys(filterConditions).forEach(key => {
                if (filterConditions[key]) {
                    queryReference = queryReference.where(key, filterConditions[key]);
                    queryThesis = queryThesis.where(key, filterConditions[key]);
                }
            });
            let resultReference = await queryReference.exec();
            let resultThesis = await queryThesis.exec();
            let resultsReferenceArray = Array.isArray(resultReference) ? resultReference : [resultReference];
            let transformedResultsRe = resultsReferenceArray.map(item => item.toObject());
            let resultsThesisArray = Array.isArray(resultThesis) ? resultThesis : [resultThesis];
            let transformedResultsThe = resultsThesisArray.map(item => item.toObject());
            let thesisResult = transformedResultsThe.filter(thesis => {
                return (thesis.status === 0);
            });  
            console.log(transformedResultsRe);
            const combinedResult = transformedResultsRe.concat(thesisResult);
            if(combinedResult)
            {   
                referenceData.status = 200;
                referenceData.errCode = 2;
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
// get pdf by id
export const getById = (fileId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            
            let pdfData = {};
            let isExist = await Reference.findOne({_id: fileId }).exec();    
            if(isExist)
            {   
                pdfData.errCode = 0;
                pdfData.errMessage ='Get pdf by id success';
                pdfData.data = {
                    ...isExist.toObject(),
                    password:'Not show'    
                };
                pdfData.status = 200;
                resolve(pdfData)
            }else{
                let checkThesis = await Thesis.findOne({_id: fileId }).exec(); 
                if(checkThesis) 
                {
                    pdfData.errCode = 0;
                    pdfData.errMessage ='Get pdf by id success';
                    pdfData.data = {
                        ...isExist.toObject(),
                        password:'Not show'    
                    };
                    pdfData.status = 200;
                    resolve(pdfData)
                }   
                else {
                    pdfData.status = 400;
                    pdfData.errCode = 3;
                    pdfData.errMessage ='Error connect'
                    resolve(pdfData) 
                }
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

