const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../Schema.js');
const Listing = require("../models/listing.js");

//validate listing

const validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let ermsg = error.details.map((el) =>
            el.message).join(",");
        throw new ExpressError(400, ermsg);
    } else {
        next();
    }
}
//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let alllistings = await Listing.find({})
    res.render('./listings/index.ejs', { alllistings });
}))

//new route 
router.get("/new", async (req, res) => {
    res.render('./listings/new.ejs');
})

//Show Route

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('./listings/show.ejs', { listing });
}));


//create route
router.post("/", validatelisting, wrapAsync(async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect('/listings');

}));

//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', { listing });
}));

//update route
router.put("/:id", validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}
));


//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    res.redirect('/listings');
}));

module.exports = router;