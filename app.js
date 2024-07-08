const express = require('express');
const mongoose = require('mongoose');
const app = express();
const listing=require("./models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().
then(()=>{
    console.log("Connected to MongoDB");
})
.catch(err=>{
    console.error("Error connecting to MongoDB",err);
})
app.get('/',(req,res)=>{
    res.send("hi,I am root");
});

app.get('/testlisting',async (req,res)=>{
      let samplelisting =new listing({
        title: "My new home",
        description: "By the beach",
        price: 100,
        location: "Calangute,goa",
        country:"India"
      });
      await samplelisting.save();
      console.log("Sample was saved successfully");
      res.send("Sucessfull testing");
})
app.listen(8080,()=>{
    console.log("Serevr is listening to port 8080")
});