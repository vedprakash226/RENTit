const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient  = mbxGeocoding({accessToken: mapToken});


module.exports.index =  async(req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNew_form = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res)=>{
    let {id}=req.params;
    let data  = await Listing.findById(id).populate({path:"reviews",populate:{path: "author"}}).populate("owner");
    if(!data){
        req.locals = req.flash("error", "Your listing request Doesn't exists!!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {data});
}

module.exports.createListing = async(req, res, next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    console.log(response.body.features[0].geometry.coordinates);
    // res.send("!done")

    let url = req.file.path;        //path for the image uploaded by user
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;       //geometry of the location saved;

    let savedListing = await newListing.save();
    console.log(savedListing);
    res.locals = req.flash("success","New user added")
    res.redirect("/listings");
}

module.exports.renderEdit_form = async (req, res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    if(!data){
        req.flash("error", "Your listing request Doesn't exists!!");
        res.redirect("/listings");
    }
    let originalUrl = data.image.url;
    transformedUrl = originalUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {data, transformedUrl});
}

module.exports.updateListing = async (req, res)=>{
    let {id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    res.locals = req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.locals = req.flash("success","Listing Deleted")
    res.redirect("/listings");
}