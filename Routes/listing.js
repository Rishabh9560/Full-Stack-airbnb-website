const express = require("express") ; 
const Listing = require("../models/listing.js");
const router = express.Router() ;
const {isLoggedIn  , isOwner} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require('multer') ;
const {storage} = require("../cloudConfig.js") ;
const upload = multer({ storage });


//------------------INDEX ROUTE-----------------//
router.get("/" , (listingController.index)) ;


//-----------NEW ROUTE------------//
router.get("/new" , isLoggedIn , (listingController.renderNewForm));
//------------SHOW ROUTE-------------//
router.get("/:id" ,(listingController.showListing));
//----------create new route---//
router.post("/" ,isLoggedIn, upload.single("listing[image]"), (listingController.createListing));
//---------EDIT ROUTE-------//
router.get("/:id/edit"  , isLoggedIn, isOwner,(listingController.renderEditForm ));
//--------------UPDATE ROUTE--------//
router.put("/:id",isLoggedIn,isOwner ,upload.single("listing[image]"),(listingController.updateListing));
//--------------DELETE ROUTE--------------//
router.delete("/:id"  , isLoggedIn,isOwner, (listingController.destroyListing));

module.exports = router;