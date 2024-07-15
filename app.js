const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const methodOveride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const listings =require("./routes/listing.js");
const reviews =require("./routes/review.js");
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true

    }
};

//new route
app.get('/', (req, res) => {
    res.send("hi,I am root");
});

app.use(session(sessionOptions));
app.use(flash())

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

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log(res.locals.success);
    next();
})

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)


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