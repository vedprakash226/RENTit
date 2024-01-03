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

const listings = require("./route/listing.js");
const reviews = require("./route/review.js");

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

//Root
app.get("/",(req, res)=>{
    res.render("listings/welcome.ejs");
});

//All the listing routes are in the route listing file we are requireing all the routes from there
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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