let router = express.Router();
import { 
	handleGGLogin
   } 
from "../controllers/customers/userController.js" ;
import { 
	handleUserLogOut
   } 
from "../services/userService.js" ;
import express from "express";
import passport from "passport";
let authRoute = (app) =>{
	//register

	//login
	router.get("/auth/login/success", handleGGLogin); 	
	router.get("/auth/login/failed", (req, res) => {
		res.status(400).json({
			error: true,
			message: "Log in failure",
		});
	});
	router.get("/auth/google", passport.authenticate("google", ["profile", "email"]));
	router.get("/auth/google/callback",
		passport.authenticate("google", {
			successRedirect: process.env.CLIENT_URL,
			failureRedirect: "/login/failed",
		})
	);
	//log out
	router.get("/auth/logout", async (req, res) => {
		req.logout();
		try{
			await handleUserLogOut(req.body.idUser);
			res.redirect(process.env.CLIENT_URL);
		} catch(e)
		{
			console.log(e);
		}
	});
	return app.use("/", router);
}
export default authRoute;
