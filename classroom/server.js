const express = require('express');
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session")
const flash = require("connect-flash")
const sessionOptions ={ secret: "mysupersecretstring",
    resave: false, 
    saveUninitialized: true
}
const path= require('path');

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"))


app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    next();
})
app.get("/register", (req, res) => {
    let {name="anonymous"}=req.query;
    req.session.name =name;
    
    if(name == "anonymous"){
        
        req.flash("error","User not registered");
    }else{
        req.flash("success","User registered successfully");

    }
    res.redirect("/hello");
})
app.get("/hello", (req, res) => {
    res.render("page.ejs",{name: req.session.name})
})
// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;

//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you send a request ${req.session.count} times`);
// })

// app.get('/test',(req,res)=>{
//     res.send("Test successful");
// })

app.listen(3000, () => {
    console.log('server listening 3000');
})