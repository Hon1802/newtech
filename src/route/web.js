import express from "express";
//import controllers
import {    getHomePage    } from "../controllers/homeController.js";
import { 
         handleLogOut,
         updateAvatar,
         getUserById,
         getUserByUserId,
         updateInfoById,
         deleteUserById,
         blackHandleGGLogin
        } 
    from "../controllers/customers/userController.js" ;
import { 
    handleAddNewThesis,
    uploadReference,
    getReference,
    readPdf,
    getAllThesisNotCompleted,
    registerThesis,
    } 
   from "../controllers/admins/thesisController.js" ;
import {   
    createTask,
    removeTask,
    submitTask,
    evaluateTask
} 
from "../controllers/admins/lectureController.js"
let router = express.Router();
let initWebRoutes = (app)=>{
    router.get('/', (req,res)=>{
        return res.json({data:'hello word'})
    });
    router.get('/homePage', getHomePage);
    router.get('/getById/:id', (req,res)=>{
        res.send('get by id' + req?.params?.id??"")
    });
    //user
    // auth
    router.post('/auth/login', blackHandleGGLogin);
    router.post('/api/logout', handleLogOut);
    // 
    router.post('/api/upload-avatar', updateAvatar);
    router.post('/api/update-by-id', updateInfoById);
    // by id in db
    router.post('/api/personal', getUserById);
    // by id user, "20110000"
    router.post('/api/get-by-user-id', getUserByUserId);
    router.post('/api/delete-account', deleteUserById);
    // register thesis
    router.post('/api/register-thesis', registerThesis);
// thesis
    router.post('/api/upload-thesis', handleAddNewThesis);
    router.post('/api/upload-reference', uploadReference);
    router.post('/api/get-reference', getReference);
    router.post('/api/get-all-thesis', getAllThesisNotCompleted);
    router.post('/api/read-pdf', readPdf);
    router.post('/api/create-task', createTask);
    router.post('/api/remove-task', removeTask);
    router.post('/api/submit-task', submitTask);
    router.post('/api/evaluate-task', evaluateTask);
    return app.use("/", router); 
}

export default initWebRoutes; 