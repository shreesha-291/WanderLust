const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOveride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const {listingSchema} = require('./Schema.js')
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "public")));



async function main() {
    await mongoose.connect(MONGO_URL);
}
main().
    then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB", err);
    })

//new route
app.get('/', (req, res) => {
    res.send("hi,I am root");
});

//validate listing

const validatelisting =(req, res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let ermsg=error.details.map((el)=>
            el.message).join(",");
        throw new ExpressError(400, ermsg);
    }else{
        next();
    }
}
//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    let alllistings = await Listing.find({})
    res.render('./listings/index.ejs', { alllistings });
}))

app.get("/listings/new", async (req, res) => {
    res.render('./listings/new.ejs');
})

//create route
app.post("/listings",validatelisting, wrapAsync(async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect('/listings');

}));

//Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', { listing });
}));

//update route
app.put("/listings/:id", validatelisting,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}
));

//Show Route

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', { listing });
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    res.redirect('/listings');
}));
// app.get('/testlisting',async (req,res)=>{
//       let samplelisting =new listing({
//         title: "My new home",
//         description: "By the beach",
//         price: 100,
//         location: "Calangute,goa",
//         country:"India"
//       });
//       await samplelisting.save();
//       console.log("Sample was saved successfully");
//       res.send("Sucessfull testing");
// })

//if user goes to some random route then this absorbs the request and gives error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
//middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });

    // res.status(statusCode).send(message);
})
app.listen(8080, () => {
    console.log("Serevr is listening to port 8080")
});