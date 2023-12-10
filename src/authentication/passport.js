import gStrategy from "passport-google-oauth20";
const GoogleStrategy = gStrategy.Strategy;
import passport from "passport";
import {
	blackHandleGGLogin
} from "../controllers/customers/userController.js"
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID_GG,
			clientSecret: process.env.CLIENT_SECRET_GG,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		async function (accessToken, refreshToken, profile, done) {
			let idGG = profile.emails[0].value;
			console.log(idGG);
			let userProfile = await blackHandleGGLogin(idGG);
			console.log(userProfile);
			return done(null, userProfile);
			// callback(null, profile);
		}
	)
);
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
export default passport;
