import { Thesis } from "../models/index.js"

// register
export const handleAddThesis = (
                                title,
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
                        author : author,
                        member : member,
                        instructor : instructor, 
                        type : type,
                        result: result,
                        reference: reference,
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