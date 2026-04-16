if(process.env.NODE_ENV != "production"){
    require('dotenv').config() ;
}
const express = require("express") ;
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const app = express() ;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate") ;
const listings = require("./Routes/listing.js");
// const wrapAsync = require("./utils/wrapAsync.js") ;
// const ExpressError = require("./utils/expressError.js") ;
const Review = require("./models/review.js") ; 
const review = require("./Routes/review.js") ;
const  session = require("express-session") ;
const MongoStore = require("connect-mongo");
const flash = require("connect-flash") ;
const passport = require("passport") ;
const localStrategy = require("passport-local") ;
const User =  require("./models/user.js");
const userRouter = require("./Routes/user.js");
const { isLoggedIn, isReviewAuthor } = require("./middleware.js");
const reviewController = require("./controllers/reviews.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
.then(() =>{
    console.log("Connected to DB") ;
 })
 .catch((err) =>{
    console.log(err)
 });
async function main(){
    await mongoose.connect(dbUrl) ;
}

 

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine('ejs' , ejsMate);
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));


//===========session=======//
const store = MongoStore.create({
    mongoUrl: dbUrl , 
    crypto : {
        secret: process.env.SECRET ,
    },
    touchAfter : 24*3600 ,
});
store.on("error" , ()=>{
    console.log("Error in Mongo Session Store" ,err)
});
const sessionOptions = {
    store,
    secret :  process.env.SECRET , 
    resave : false , 
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7*24*60*60*1000 ,
        httpOnly : true , 
    }

};



app.use(session(sessionOptions));
app.use(flash()) ;

// ===============For passport=========//
app.use(passport.initialize());
app.use(passport.session())  ;
passport.use(new localStrategy(User.authenticate())) ;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req , res , next) =>{
    res.locals.success = req.flash("success") ;
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    
    next() ;
});

// //===========demo work for using signup//
// app.get("/demouser" , async(req  , res) =>{
//     let fakeUser = new User({
//         email : "student@gmail.com"  ,
//         username : "Rishabh" ,
//     }) ; 
//     let registeredUser = await User.register(fakeUser , "Rishabh98");
//     res.send(registeredUser);
// })




// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


// app.get("/testListing" ,async (req ,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa" , 
//         description : "By the Beach",
//         price : 1200 ,
//         location : "Calanguate , Goa" ,
//         country: "India" ,

//     });
//     await sampleListing.save();
//     console.log("Sample was saved") ;


// })
// app.get("/" , (req  , res) => {
//     res.send("hi , I am a root") ;
// });
// //------------------INDEX ROUTE-----------------//
// app.get("/listings" ,async (req , res) =>{
//     const allListings = await Listing.find({}) ;
//     res.render("listings/index.ejs" , {allListings})
// });
// //-----------NEW ROUTE------------//
// app.get("/listings/new" , (req  ,res) =>{
//     res.render("listings/new.ejs");
// });
// //------------SHOW ROUTE-------------//
// app.get("/listings/:id" ,async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs" , {listing})

// });
// //----------create new route---//
// app.post("/listings" , async (req , res , next) =>{
    
//     const newListings = new Listing(req.body.listing);
//     await newListings.save();
//     res.redirect("/listings") ;
   
// });
// //---------EDIT ROUTE-------//
// app.get("/listings/:id/edit" , async (req,res)=>{
//     let {id} =req.params;
//     const listing = await Listing.findById(id) ;
//     res.render("listings/edit.ejs", {listing});
// });
// //--------------UPDATE ROUTE--------//
// app.put("/listings/:id", async (req,res)=>{
//     let {id} = req.params ;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect("/listings");
// });
// //--------------DELETE ROUTE--------------//
// app.delete("/listings/:id" ,  async(req  , res)=>{
//     let {id} = req.params ;
//     let deletedListing = await Listing.findByIdAndDelete(id) ;
//     res.redirect("/listings");

// });
 app.use("/listings" , listings);
 app.use("/" , userRouter);
 
//===================REVIEWS============//
// //post  REVIEW Routes
app.post("/listings/:id/reviews" ,isLoggedIn , (reviewController.createReview));


//==========POST DELETE ROUTE ==========//
app.delete("/listings/:id/reviews/:reviewId" ,isLoggedIn,isReviewAuthor,(reviewController.destroyReview) );



//--------------------ERROR HANDLING-------//

// app.all("*" , ( req ,res , next)=>{
//     next(new expressError(404 , "page not found"));

// }) ;
// app.use((err,req , res , next)=>{
//     let {statuscode , message} = err ;
//     res.status(statuscode).send(message) ;



// });
app.get("/", (req, res) => {
    res.redirect("/listings"); 

});
 
app.listen(port, () => {
    console.log(`app listening to port ${port}`);
});