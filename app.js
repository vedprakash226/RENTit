const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");       //this is for the validation help by Joi
const Review = require("./models/review.js");

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(res=>{console.log("connection with database success")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

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

const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMessage =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMessage);
    }else{
        next();
    }
}

app.get("/",(req, res)=>{
    res.render("listings/welcome.ejs");
})

app.get("/listings",wrapAsync( async(req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}))

app.get("/listings/new",(req, res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id", wrapAsync( async (req, res)=>{
    let {id}=req.params;
    let data  = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {data});
}))

//Create Route
app.post("/listings",validateListing, wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}))

app.get("/listings/:id/edit", wrapAsync( async (req, res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    res.render("listings/edit.ejs", {data});
}))

//update route
app.put("/listings/:id",validateListing,  wrapAsync( async (req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async(req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Post Route for Review
app.post("/listings/:id/review",validateReview, wrapAsync(async (req,res)=>{
    let listing =await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
}))

//Delete Route for the reviews
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}))

// app.get("/testListing", (req, res)=>{
//     let list = new Listing({
//         title:"My sweet Villa",
//         description: "Beside the beach",
//         price:"500000000",
//         location:"Calicut, Goa",
//         country: "India"
//     });

//     list.save().then((res)=>{
//         console.log("Info saved");
//     });

//     res.send("Saved Successfully");
// })

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next)=>{
    let {status=500, message="Something went Wrong"}=err;
    res.render("listings/error.ejs", {message});
    // res.status(status).send(message);
    // res.send("Something went wrong");
})

app.listen(8080, ()=>{
    console.log("Server is working")
})
