const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(res=>{console.log("connection with database success")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () =>{
    await Listing.deleteMany({});
    //adding the owner field to the data
    initData.data =  initData.data.map((obj)=>({...obj, owner: "66337162dc62b4d75228dda2"}));
    await Listing.insertMany(initData.data);
    console.log("Data saved");
}

initDB();