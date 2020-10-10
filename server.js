//Dependencies & Requirements
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");
const app=express();
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

let otp;
let loggedIn=false;
//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');


//Using bodyParser
app.use(bodyParser.urlencoded({extended: true}));


//Adding public folder as a static source of our project
app.use(express.static("public"));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false,useCreateIndex: true, });


function createNewOTP(){
    // Generate a 6 digit numeric OTP
    otp      = otpGenerator.generate(6, {alphabets: false, upperCase: false, specialChars: false});
    const ttl      = 2 * 60 * 1000; //5 Minutes in miliseconds
    const expires  = Date.now() + ttl; //timestamp to 5 minutes in the future
    const data     = `${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash     = crypto.createHmac("sha256",process.env.KEY).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
    // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
    console.log(`Your OTP is ${otp}. it will expire in 1 minutes`);
    return fullHash;
}

//Sample questions data base schema
const sampleQSchema=new mongoose.Schema({
  lesson:{
    type:String,
    required:true
  },
  subject:{
    type:String,
  },
  university:{
    type:String,
    required:true
  },
  difficulty:{
    type:Number,
    //1 means easy and 3 means hard
    min:1,
    max:3
  },
  rating:{
    type:Number,
    //rating method for our sample questions 1 is the worst and 5 is the best
    min:1,
    max:5
  },
  downloadedCount:{
    type:Number
  }



});

//Creating the sample questions schema document
const SampleQ=mongoose.model("SampleQ",sampleQSchema);



//User data base schema
const usersSchema=new mongoose.Schema({
  phone:{
    type:String,
    required:true,
    unique: true
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  university:{
    type:String
  },
  email:{
    type:String
  },
  username:{
    type:String
  },
  sampleQDown:[sampleQSchema]

});

usersSchema.plugin(passportLocalMongoose);
//Creating the user document
const User=mongoose.model("User",usersSchema);



passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//landing page
app.get("/",function(req,res){
  res.render("home",{loggedIn:loggedIn});
});

//start page
app.get("/start",function(req,res){
  res.render("start");

});


app.post("/start",function(req,res){

  const phoneNumber=req.body.submitPhoneNumber;

  const newUser=new User({
    phone:phoneNumber

    });

  newUser.save((err, data) => {
      console.log('Analyzing Data...');
      if(data) {
          console.log('Your data has been successfully saved.');
          newUser.save();
          res.render("verify",{phoneNumber:phoneNumber});
          createNewOTP();
  }
  else {
    console.log('Repetetive user');
    res.render("verify",{phoneNumber:phoneNumber});
    createNewOTP();

  }

  });
  });


app.post("/verify",function(req,res){
  const phoneNumber=req.body.submitPhoneNumber;
    const verifyCodeUserEntered=req.body.verificationCode;

    if(verifyCodeUserEntered===otp){
      console.log("Success");
      loggedIn=true;
      res.render("signUp");

    }else{
      console.log("wrong code");
      res.render("verify",{phoneNumber:phoneNumber});
      createNewOTP();
    }
});


app.post("/back",function(req,res){
  res.render("start");
});
app.post("/signUp",function(req,res){
  User.updateMany({phone:"09102310378"},
    {firstName:req.body.submitFirstName,
    lastName:req.body.submitLastName,
    university:req.body.submitUniName,
    email:req.body.submitEmail}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Docs : ", docs);
    }
});

  res.render("home",{loggedIn:loggedIn});
});

//Opening and starting our server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
