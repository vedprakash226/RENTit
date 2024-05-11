const User = require("../models/user");

module.exports.signUp = async(req, res)=>{
    try{
    let {username, email, password}=req.body;
    let userInfo = new User({email, username})

    let registeredUser = await User.register(userInfo, password);
    console.log(registeredUser);
    
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.locals = req .flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out successfully")
        res.redirect("/listings");
    })
}

module.exports.loginFormRenderer = (req, res)=>{
    res.render("user/login.ejs");
}

module.exports.loginSuccess = async(req, res)=>{
    req.flash("success", "Welcome back to wanderlust")
    
    if(res.locals.redirectUrl) url = res.locals.redirectUrl;
    else url = "/listings";

    res.redirect(url);
}