const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index",{allListing});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{
        path:"author",}
    }).populate("owner");
    res.render("listings/show.ejs", {listing});
}

module.exports.createListings = async(req, res, next) =>{
    // listingSchema.validate(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        req.flash("success", "New Listing created");
        res.redirect("/listings");
}

module.exports.renderEditeForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let originalListinImage = listing.image.url;
    originalUrl = originalListinImage.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing, originalUrl});
}

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    let deletListing = await Listing.findByIdAndDelete(id);
    console.log(deletListing);
    res.redirect("/listings");
}