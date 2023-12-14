import express from "express";
//import controllers
import {    getHomePage    } from "../controllers/homeController.js";
import { 
         handleLogOut,
         updateAvatar,
         getUserById,
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
    getAllThesisNotCompleted
    } 
   from "../controllers/admins/thesisController.js" ;
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
    router.post('/api/personal', getUserById);
    router.post('/api/update-by-id', updateInfoById);
    router.post('/api/delete-account', deleteUserById);
// thesis
    router.post('/api/upload-thesis', handleAddNewThesis);
    router.post('/api/upload-reference', uploadReference);
    router.post('/api/get-reference', getReference);
    router.post('/api/get-all-thesis', getAllThesisNotCompleted);
    router.post('/api/read-pdf', readPdf);
    return app.use("/", router); 
}

export default initWebRoutes; 