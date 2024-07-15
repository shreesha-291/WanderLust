const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../Schema.js')
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    if (req.method === "DELETE") return next(); 
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let ermsg = error.details.map((el) =>
            el.message).join(",");
        throw new ExpressError(400, ermsg);
    } else {
        next();
    }
}


//post  Review route
router.post('/', validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success',"New Review created!")
    console.log("New review saved")
    res.redirect(`/listings/${listing._id}`);

}))

//Delete Review Route
router.delete("/:reviewId", validateReview, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Review deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports = router;