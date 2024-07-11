const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title: {
        type:String,
        required: true
    },
    description: String,
    image:{
        filename: {
          type: String,
        },
        url:{
            type: String
        }
    },
    price: Number,
    location: String,
    country:String
});
const listing =mongoose.model('Listing',listingSchema);
module.exports =listing;