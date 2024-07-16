const Listing = require('./models/listing')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('./Schema.js');

module.exports.isLoggedIn =(req,res,next)=>{
    //RedirectURl
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"You must be logged in to create a listing!");
        return res.redirect('/login')
    }
    next();
}
module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next()
}
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let ermsg = error.details.map((el) =>
            el.message).join(",");
        throw new ExpressError(400, ermsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
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

module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Sorry, You are not allowed to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next()
}