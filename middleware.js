const Listing = require("./models/listing");
const {listingSchema, reviewSchema}=require("./schema.js");  
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not registered/Login on Platform");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    // console.log(res.locals.redirectUrl)
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currUser||!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to do that!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMessage =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMessage);
    }else{
        next(); 
    }
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review  = await Review.findById(reviewId);
    if(!res.locals.currUser || !review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to do that!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}