const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { route } = require("./listing.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
.get((req, res)=>{
    res.render("user/signup.ejs");
})
.post(wrapAsync(userController.signUp))


//All the controlling code inside each router is shifted to the controllers folder to look the code clean.

//This route is to create a new user.  The code that functions inside this route is now shifted to the user.
// router.post("/signup", wrapAsync(userController.signUp));

router.route("/login")
.get(userController.loginFormRenderer)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect:'/login', failureFlash: true}), userController.loginSuccess)

// router.get("/login", userController.loginFormRenderer);

// router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect:'/login', failureFlash: true}), userController.loginSuccess);

//to logout from the platform
//The code that functions inside this route is now shifted to the user controllers. 
router.get("/logout", userController.logout);

module.exports = router;