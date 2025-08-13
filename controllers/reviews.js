const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req , res) =>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review) ;
 newReview.author = req.user._id ;
 listing.reviews.push(newReview) ;
 await newReview.save() ;
 await listing.save() ; 
 req.flash("success" , "Review Created!");
 res.redirect(`/listings/${listing.id}`);

}
module.exports.destroyReview = async(req ,res) =>{  //Wrap async use hoga//
    let {id,reviewId} = req.params ;
    Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});//special operator of mongoo//
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted");
    res.redirect(`/listings/${id}`);
}