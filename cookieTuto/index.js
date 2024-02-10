const express = require("express");
const app = express();
const flash = require('connect-flash');
// const cookieParser = require("cookie-parser");
const session = require("express-session")

app.use(session({secret:"thesupercodeer", resave:false, saveUninitialized:true}));
app.use(flash());

app.get("/test",(req, res)=>{
    res.send("test done")
})

app.get("/register",(req, res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    req.flash("success", "info updated successfully");
    console.log(req.session)
    res.redirect("/hello",)
})

app.get("/hello",(req, res)=>{
    res.send(`hello, ${req.session.name}`)
})

// app.get("/request",(req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You send me ${req.session.count} requests`)
    
// })

// app.use(cookieParser("secretcode"));

// app.get("/",(req, res)=>{
//     console.log(req.cookies);
//     res.send("proceed");
// })

// app.get("/signedcookie",(req, res)=>{
//     res.cookie("name","Ved",{signed:true});
//     res.cookie("name2","Shr",{signed:true});
//     res.send("working")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("work done");
// })

// app.get("/getcookie",(req, res)=>{
//     res.cookie("made in","India");
//     res.cookie("color", "red");
//     res.send("hello");
// })




app.listen(3000,(req, res)=>{
    console.log("connected")
})