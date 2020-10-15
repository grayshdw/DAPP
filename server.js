//Dependencies & Requirements
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const generateOTP = require(__dirname + "/localModules/generateOTP.js")
require('dotenv').config();
//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');


//Using bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));


//Adding public folder as a static source of our project
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  signed: true,
}));

app.use(passport.initialize());
app.use(passport.session());


//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});


//Sample questions data base schema
const sampleQSchema = new mongoose.Schema({
  lesson: {
    type: String,
    required: true
  },
  subject: {
    type: String,
  },
  university: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    //1 means easy and 3 means hard
    min: 1,
    max: 3
  },
  rating: {
    type: Number,
    //rating method for our sample questions 1 is the worst and 5 is the best
    min: 1,
    max: 5
  },
  downloadedCount: {
    type: Number
  }



});

//Creating the sample questions schema document
const SampleQ = mongoose.model("SampleQ", sampleQSchema);



//User data base schema
const usersSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  university: {
    type: String
  },
  email: {
    type: String
  },
  password:{
    type:String
  },
  verifyCode: Number,
  registered: String,
  verified: String,

});

usersSchema.plugin(passportLocalMongoose);

//Creating the user document
const User = new mongoose.model("User", usersSchema);



passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//landing page
app.get("/", function(req, res) {
  res.render("home");
});

//start page
app.get("/start", function(req, res) {
  res.render("start");

});
app.get("/dashboard", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect("/start");
  }
});

app.post("/profile", function(req, res) {

});


app.post("/start", function(req, res) {

  User.findOne({ phone:req.body.submitPhoneNumber }, function(err, found) {
  if (!err) {
    if (found) {
      User.updateMany({phone:req.body.submitPhoneNumber},{verifyCode:generateOTP.createNewOTP(),verified: "false"},function(err,docs){if(!err){console.log(docs+" updated successfuly");}});
      }
    if (!found){
      const user = new User({
        phone: req.body.submitPhoneNumber,
        verifyCode: generateOTP.createNewOTP(),
        verified: "false",
        registered: "false",
      });
      user.save(function(err, docs) {
          if (!err) {
            console.log("Document inserted succussfully!");
          }
        });
      }
    }
    setInterval(function () {
      User.updateOne({phone:req.body.submitPhoneNumber},{verifyCode:generateOTP.createNewOTP()},function(err,docs){if(!err){console.log(docs+" updated successfuly");}});
    }, 60000);


  res.render("verify", {
    phoneNumber: req.body.submitPhoneNumber
  });
});
});


app.post("/verify", function(req, res){

  User.findOne({phone: req.body.phoneNumber},function(err,found){
    if(!err){
      if(found.verifyCode==req.body.verificationCode){
        console.log("Its's a match!");
         User.updateOne({phone:req.body.phoneNumber},{verified: "true"},function(err,docs){if(!err){console.log(docs+" updated successfuly");}});
         if(found.registered==="true"){res.render("logIn",{phoneNumber:req.body.phoneNumber});}
         if(found.registered==="false"){res.render("signUp",{phoneNumber:req.body.phoneNumber});}
       }else{console.log("Wrong Code!");
       User.updateMany({phone:req.body.phoneNumber},{verifyCode:generateOTP.createNewOTP(),verified:"false"},function(err,docs){if(!err){console.log(docs+" updated successfuly");}});
       setInterval(function () {
         User.updateMany({phone:req.body.phoneNumber},{verifyCode:generateOTP.createNewOTP(),verified:"false"},function(err,docs){if(!err){console.log(docs+" updated successfuly");}});
       }, 60000);
     }
    }
  });
});


app.post("/backToStart", function(req, res) {
  res.redirect("/start");
});


app.post("/signUp", function(req, res) {


      User.updateMany({phone:req.body.submitPhone},{firstName:req.body.submitFirstName,lastName:req.body.submitLastName,university:req.body.submitUniName,email:req.body.submitEmail,password:req.body.submitPassword,registered:"true"},function(err,docs){
        if(!err){
            console.log(docs+" updated successfuly");
            passport.authenticate("local")(req,res,function(){
              res.redirect("/dashboard");
        });
        }
      });


});
app.post("/login",function(req,res){
  console.log();
User.findOne({phone:req.body.submitPhone},function(err,found){
  if(!err){
    if(found.password===req.body.submitPassword){
      console.log("success");
      passport.authenticate("local")(req,res,function(){
        res.redirect("/dashboard");

});
}else{
  console.log("Wrong Password!");
  res.render("logIn",{phoneNumber:req.body.submitPhone});
}

    }

});

});
app.post("/start", function(req, res) {


});

//Opening and starting our server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
