const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema}=require("../schema.js");  
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js");

// Post Route for Review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//Delete Route for the reviews
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;