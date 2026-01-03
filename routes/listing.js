const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateListing,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    .get(wrapAsync(listingController.index))  //Index route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))//Create Route

router
    .route("/search")
    .get(wrapAsync(listingController.searchListing));

//Create new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings)) //Show Route
    .put(isLoggedIn,upload.single('listing[image]'),isOwner,validateListing,wrapAsync(listingController.updateListing)) //Update Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //DELETE ROUTE

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;