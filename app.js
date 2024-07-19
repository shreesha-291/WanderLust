if(process.env.NODE_ENV != 'production'){
require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const methodOveride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const dbUrl = process.env.ATLASDB_URL;


const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


const listingRouter =require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter = require('./routes/user.js');

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60
})

store.on("error",()=>{
    console.log("Error in mongo session store",err)
})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true

    }
};

//new route
// app.get('/', (req, res) => {
//     res.send("hi,I am root");
// });


app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));


async function main() {
    await mongoose.connect(dbUrl);
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
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req, res) => {
//     let fakeuser =new User({
//        email:"user@example.com",
//        username:"user",
//     });
//     let registeredUSer =await User.register(fakeuser,"helloworld");
//     res.send(registeredUSer)
// })
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);
// app.post("listings/search",(req, res) => {
//     res.render("hai")
// })
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