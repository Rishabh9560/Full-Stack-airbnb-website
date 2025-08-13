// const express = require("express") ; 

// const router = express.Router({mergeParams:true}) ;
// const Review = require("../models/review.js")
// //===================REVIEWS============//
// //post  REVIEW Routes
// router.post("/" , async(req , res) =>{
//  let listing = await Listing.findById(req.params.id);
//  let newReview = new Review(req.body.review) ;
//  listing.reviews.push(newReview) ;
//  await newReview.save() ;
//  await listing.save() ; 
//  res.redirect(`/listings/${listing.id}`);

// });


// //==========POST DELETE ROUTE ==========//
// router.delete("/:reviewId" , async(req ,res) =>{  //Wrap async use hoga//
//     let {id,reviewId} = req.params ;
//     Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});//special operator of mongoo//
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// });
// module.exports = router; 