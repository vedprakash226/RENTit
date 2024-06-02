if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();

}
// console.log(process.env)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema}=require("./schema.js");       //this is for the validation help by Joi
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

//Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

//Route files requiring
const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");

const sessionOptions = {
    secret:"mysupersecret",
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpsOnly: true,
    }
}

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(res=>{console.log("connection with database success")})
.catch(err => console.log(err));

//this function sets up the environment for the database initialization .

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//Root

app.use(session(sessionOptions));
app.use(flash());

//Authentication using the passport 
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email: "helloIITk@gmail.com",
//         username: "vedprakash"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld")
//     res.send(registeredUser)
// })

// app.get("/",(req, res)=>{
//     res.render("listings/welcome.ejs");
// });

//All the listing routes are in the route listing file we are requireing all the routes from there
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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
