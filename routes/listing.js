const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner,validatelisting} =require('../middleware.js')

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let alllistings = await Listing.find({})
    res.render('./listings/index.ejs', { alllistings });
}))

//new route 
router.get("/new", isLoggedIn,(req, res) => {
    res.render('./listings/new.ejs');
})

//Show Route

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate(
        {
            path:"reviews",
            populate:{
                path:"author"
            }
        })
        .populate("owner");
    if(!listing){
        req.flash('error',"Listing you requested does not exist!");
        res.redirect('/listings')
    }
    console.log(listing);
    res.render('./listings/show.ejs', { listing });
}));


//create route
router.post("/",isLoggedIn,validatelisting, wrapAsync(async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; 
    await newlisting.save();
    req.flash('success',"New listing created!")
    res.redirect('/listings');

}));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error',"Listing you requested does not exist!");
        res.redirect('/listings')
    }
    res.render('./listings/edit.ejs', { listing });
}));

//update route
router.put("/:id",isLoggedIn, isOwner,validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success',"Listing Updated!")
    res.redirect(`/listings/${id}`);
}
));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,
     wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash('success',"New listing Deleted!");
    res.redirect('/listings');
}));

module.exports = router;