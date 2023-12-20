import express from "express";
//import controllers
import {    getHomePage    } from "../controllers/homeController.js";
import { 
        getUserById,
        updateAvatar,
        handleLogOut,
        updateInfoById,
        deleteUserById,
        getUserByUserId,
        blackHandleGGLogin
        } 
    from "../controllers/customers/userController.js" ;
import { 
    readPdf,
    readTask,
    browseThesis,
    getReference,
    registerThesis,
    getBrowseThesis,
    uploadReference,
    getRegisterThesis,
    handleAddNewThesis,
    cancelRegisterThesis,
    browseRegisterThesis,
    getAllThesisNotCompleted,
    } 
   from "../controllers/admins/thesisController.js" ;
import {   
    createTask,
    removeTask,
    submitTask,
    evaluateTask,
    getTask
} 
from "../controllers/admins/lectureController.js"
import {
    getMajor,   
    addAccount,
    getAllUser,
    deleteAccount,
    getAnnouncement,
    updateThesisById,
    removeThesisById,
    getAnnouncementById,
    addAnnouncementAccount,
} from '../controllers/admins/adminController.js'
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
    
    // by id in db
    router.post('/api/personal', getUserById);
    // by id user, "20110000"
    router.post('/api/get-by-user-id', getUserByUserId);
    router.post('/api/delete-account', deleteUserById);
    // register thesis
    router.post('/api/register-thesis', registerThesis);
    router.post('/api/get-register-thesis', getRegisterThesis);
    router.post('/api/browse-register-thesis', browseRegisterThesis);
// thesis
    router.post('/api/upload-thesis', handleAddNewThesis);
    router.post('/api/upload-reference', uploadReference);
    router.post('/api/get-reference', getReference);
    router.post('/api/get-all-thesis', getAllThesisNotCompleted);
    router.post('/api/read-pdf', readPdf);
    router.post('/api/read-task', readTask);
    router.post('/api/create-task', createTask);
    router.post('/api/remove-task', removeTask);
    router.post('/api/submit-task', submitTask);
    router.post('/api/evaluate-task', evaluateTask);
    router.post('/api/get-task', getTask);
    router.post('/api/browse-thesis', browseThesis);
    router.post('/api/get-thesis-browse', getBrowseThesis);
    router.post('/api/cancel-register-thesis', cancelRegisterThesis);
    //admin
    router.get('/api/admin/get-major', getMajor);
    router.get('/api/admin/get-all-user', getAllUser);
    router.post('/api/admin/add-account', addAccount);
    router.post('/api/admin/delete-account', deleteAccount);
    router.post('/api/admin/add-announcement-account', addAnnouncementAccount);
    router.post('/api/admin/get-announcement-account', getAnnouncement);
    router.post('/api/admin/get-announcement-by-id', getAnnouncementById);
    router.post('/api/admin/update-by-id', updateInfoById);
    router.post('/api/admin/update-thesis-by-id', updateThesisById);
    router.post('/api/admin/remove-thesis-by-id', removeThesisById);
    return app.use("/", router); 
}

export default initWebRoutes; 