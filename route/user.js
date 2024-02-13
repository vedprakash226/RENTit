const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { route } = require("./listing.js");
const passport = require('passport')

router.get("/signup", (req, res)=>{
    res.render("user/signup.ejs")
})

router.post("/signup", wrapAsync(async(req, res)=>{
    try{
    let {username, email, password}=req.body;
    let userInfo = new User({email, username})

    let registeredUser = await User.register(userInfo, password);
    console.log(registeredUser);

    req.locals = req .flash("success", "Welcome to WanderLust")
    res.redirect("/listings")
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

router.get("/login", (req, res)=>{
    res.render("user/login.ejs");
})

router.post("/login",passport.authenticate("local", {failureRedirect:'/login', failureFlash: true}), async(req, res)=>{
    req.flash("success", "Welcome back to wanderlust")
    res.redirect("/listings")
})

//to logout from the platform
router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out successfully")
        res.redirect("/listings");
    })
})


module.exports = router;