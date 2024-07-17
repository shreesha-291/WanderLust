const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner,validatelisting} =require('../middleware.js')
const listingController = require("../controllers/listings.js");
const multer =require('multer');
const {storage} =require('../cloudConfig.js');
const upload = multer({ storage });


//Index Route and create route
router
.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'),validatelisting,wrapAsync(listingController.createListing));
  //new route 
router.get("/new", isLoggedIn,listingController.renderNewForm);

//Show Route and update route and delete route
router
.route("/:id")
   .get( wrapAsync(listingController.showListing))
   .put(isLoggedIn, isOwner,validatelisting, wrapAsync(listingController.updateListing))
   .delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, 
    wrapAsync(listingController.renderEditForm));

module.exports = router;