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

//using other database models
var question = require(__dirname+ "/question.js");
var note = require(__dirname+ "/note.js");
var comment = require(__dirname+ "/comment.js");
var User = require(__dirname+ "/user.js");
var answer = require(__dirname+ "/answer.js");

//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
//Using bodyParser
app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}));

//Adding public folder as a static source of our project
app.use(express.static("public"));

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
//landing page
app.get("/", function(req, res) {
  res.render("home");
});

//start page
app.get("/start", function(req, res) {
  res.render("start");
  });
//uploading page
app.get("/upload", function(req, res) {
  res.render("upload");
});
//List of Notes page
app.get("/notes", function(req, res) {
  let notes = note.find({}, function(err, notesData) {
    res.render("notes",{notesDataList:notesData});
  });
});

//List of questions page
app.get("/questions", function(req, res){
  let notes = question.find({}, function(err, questionsData){
    res.render("questions", {questionsDataList: questionsData});
  });
});

//Buying a question page
app.get("/buyQ/:itemID", function(req, res) {
  const link = req.params.itemID;
  let q = question.findOne({_id: link}, function(err, q) {
    if(q)
    {
      res.render("itemDetail", {item: q});
    }
    else {
      res.render("error404");
    }

  });
});



//Buying a note page
app.get("/buyN/:itemID", function(req, res) {
  const link = req.params.itemID;
  let n = note.findOne({_id: link}, function(err, n) {
    if (n) {
      res.render("itemDetail", {item: n});
    }
    else {
      res.render("error404");
    }

  });
});
app.get("/dashboard", function(req, res) {
  // if (req.isAuthenticated()) {
  //   res.render("dashboard");
  // } else {
    res.redirect("/start");
  // }
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
      console.log("hello my frined u suck");
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
          else {
            console.log(err);
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
       }
       else{
         console.log("Wrong Code!");
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
//Question uploading form Data
app.post("/uploadQuestion", function(req, res){
  const lesson = req.body.qLesson;
  const subject = req.body.qSubject;
  const university = req.body.qUniversity;
  const newQuestion = new question({
    lesson: lesson,
    subject: subject,
    university: university
  });
  const fileEncoded = req.body.file;
  if(fileEncoded != null)
  {
    const file = JSON.parse(fileEncoded);
    if (file != null)
    {
      newQuestion.file = new Buffer.from(file.data,'base64');
    }
  }
  newQuestion.save();
  res.redirect("/upload");
});

//Commenting on a question
app.post("/buyQ/:questionID", function(req, res) {
  let link = req.params.questionID;
  let q = question.findOne({_id: link}, function(err, q) {
    if (err)
      console.log(err);
  });
  text = req.body.comment;
  console.log(text);
  /*
  console.log(link);
  const newComment = new comment({
    context: text,
    item: q
  });
  console.log(newComment);
  question.updateOne({_id: link}, {comments: text}, function(err) {
    if (err)
      console.log(err);
  });
  */
  res.redirect("/buyQ/"+ link);
});

//Commenting on a note
app.post("/buyN/:noteID", function(req, res) {
  let link = req.params.noteID;
  let n = note.findOne({_id: link}, function(err, n) {
    if (err)
      console.log(err);
  });
  const text = req.body.comment;
  console.log(text);
  /*
  console.log(link);
  const newComment = new comment({
    context: text,
    item: q
  });
  console.log(newComment);
  question.updateOne({_id: link}, {comments: text}, function(err) {
    if (err)
      console.log(err);
  });
  */
  res.redirect("/buyN/"+ link);
});

//Note uploading form Data
app.post("/uploadNote",function(req, res){
  const lesson = req.body.nLesson;
  const subject = req.body.nSubject;
  const university = req.body.nUniversity;
  const newNote = new note({
    lesson:lesson,
    subject:subject,
    university:university
  });
  const fileEncoded = req.body.file;
  if(fileEncoded != null)
  {
    const file = JSON.parse(fileEncoded);
    if (file != null)
    {
      newNote.file = new Buffer.from(file.data,'base64');
    }
  }
  newNote.save();
  res.redirect("/upload");
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
