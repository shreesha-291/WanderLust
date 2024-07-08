const mongoose = require('mongoose');
const initData=require('../init/data.js');
const listing = require('../models/listing.js');

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
const initDB = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("Data was Initialised");
}
initDB();