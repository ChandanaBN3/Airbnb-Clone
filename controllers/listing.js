const Listing = require("../models/listing.js");
const { search } = require("../routes/listing.js");
const geocoder = require("../utils/geocoder.js");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing, coords: listing.geometry.coordinates});
};

module.exports.createListing = async (req,res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const coords = await geocoder(req.body.listing.location);

    if (!coords) {
        req.flash("error", "Location not found");
        return res.redirect("/listings/new");
    }
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = {
        type: "Point",
        coordinates: [coords.lon, coords.lat],
    };

    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};

module.exports.searchListing = async (req,res) => {
    let {name} = req.query;
    let listings = await Listing.find({title:{$regex:name,$options:"i"}});
    console.log(listings);
    if(listings.length ==0){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
    }else{
        res.render("listings/search.ejs",{listings});
    } 
    
};
