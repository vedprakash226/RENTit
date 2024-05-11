const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema}=require("../schema.js");  //This is not in use now as we moved the code to controllers.
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner, validateListing}= require("../middleware.js")

const listingControllers = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.createListing));


//New route
router.get("/new",isLoggedIn, listingControllers.renderNew_form);

router.route("/:id")
.get(wrapAsync( listingControllers.showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing,  wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingControllers.deleteListing))

//Home route creating for the home directory of the website.
// router.get("/",wrapAsync(listingControllers.index));     //This code is written in router.route("/")


//show route  //The code here is shifted to controllers/listing.js to make the code more readable and maintainable.
// router.get("/:id", wrapAsync( listingControllers.showListing));

//Create Route
//here middle isLoggedIn is used to check if user is logged in or not. then validateListing is used to validate the data entered by the user. Controlling code for the listing create is shifted to controllers/listing.js
// router.post("/",validateListing, isLoggedIn, wrapAsync(listingControllers.createListing));       //This code is written in router.route("/")

//edit route
router.get("/:id/edit", isLoggedIn,isOwner,  wrapAsync(listingControllers.renderEdit_form));

//update route
//here middle isLoggedIn is used to check if user is logged in or not. then isOwner is used to check if the user is owner of the listing or not. then validateListing is used to validate the data entered by the user.
// router.put("/:id",isLoggedIn, isOwner, validateListing,  wrapAsync(listingControllers.updateListing));

//delete route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingControllers.deleteListing));

module.exports = router;