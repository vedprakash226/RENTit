const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema}=require("../schema.js");  
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn}= require("../middleware.js")


const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Home route
router.get("/",wrapAsync( async(req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}))

//New route
router.get("/new",isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync( async (req, res)=>{
    let {id}=req.params;
    let data  = await Listing.findById(id).populate("reviews");
    if(!data){
        req.locals = req.flash("error", "Your listing request Doesn't exists!!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {data});
}))

//Create Route
router.post("/",validateListing, isLoggedIn, wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.locals = req.flash("success","New user added")
    res.redirect("/listings");
}))

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    res.render("listings/edit.ejs", {data});
}))

//update route
router.put("/:id",validateListing,  wrapAsync( async (req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.locals = req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn, wrapAsync(async(req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.locals = req.flash("success","Listing Deleted")
    res.redirect("/listings");
}));

module.exports = router;