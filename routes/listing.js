const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListings))


router.get("/new", isLoggedIn, listingController.renderNewForm)

//show route
router.get("/:id", wrapAsync(listingController.showListing))


router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditeForm));

router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;