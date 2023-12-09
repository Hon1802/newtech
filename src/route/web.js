import express from "express";
//import controllers
import {    getHomePage    } from "../controllers/homeController.js";
import { 
         handleRegister,
         updateAvatar,
         getUserById,
         updateInfoById,
         deleteUserById
        } 
    from "../controllers/customers/userController.js" ;
let router = express.Router();
let initWebRoutes = (app)=>{
    router.get('/', (req,res)=>{
        return res.json({data:'hello word'})
    });
    router.get('/homePage', getHomePage);
    router.get('/getById/:id', (req,res)=>{
        res.send('get by id' + req?.params?.id??"")
    });
    router.post('/api/register', handleRegister );
    router.post('/api/upload-avatar', updateAvatar);
    router.post('/api/personal', getUserById);
    router.post('/api/update-by-id', updateInfoById);
    router.post('/api/delete-account', deleteUserById);

    return app.use("/", router);
}

export default initWebRoutes;