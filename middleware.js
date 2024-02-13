module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You are not registered/Login on Platform");
        res.redirect("/login");
    }
    next();
}