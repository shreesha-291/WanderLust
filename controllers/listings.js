const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let alllistings = await Listing.find({})
    res.render('./listings/index.ejs', { alllistings });
};
module.exports.renderNewForm = (req, res) => {
    res.render('./listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate(
        {
            path:"reviews",
            populate:{
                path:"author"
            }
        })
        .populate("owner");
    if(!listing){
        req.flash('error',"Listing you requested does not exist!");
        res.redirect('/listings')
    }
    console.log(listing);
    res.render('./listings/show.ejs', { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; 
    newlisting.image ={url,filename};
    await newlisting.save();
    req.flash('success',"New listing created!")
    res.redirect('/listings');

}

module.exports.renderEditForm =async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error',"Listing you requested does not exist!");
        res.redirect('/listings')
    }
    res.render('./listings/edit.ejs', { listing });
}

module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success',"Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash('success',"New listing Deleted!");
    res.redirect('/listings');
}