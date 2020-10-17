//Dependencies & Requirements
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

//using other database models
var question = require(__dirname+ "/question.js");
var note = require(__dirname+ "/note.js");
var comment = require(__dirname+ "/comment.js");
var user = require(__dirname+ "/user.js");
var answer = require(__dirname+ "/answer.js");

//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');

//Using bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Adding public folder as a static source of our project
app.use(express.static("public"));

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});




//landing page
app.get("/", function(req, res) {
  res.render("main");
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
  newNote.save();
  res.redirect("/upload");
});

// Logining in
app.post("/start",function(req,res){
  const phoneNumber = req.body.submitPhoneNumber;
  const newUser = new user({
    phone: phoneNumber
  });
  newUser.save((err, data) => {
    console.log('Analyzing Data...');
    if(data) {
        console.log('Your data has been successfully saved.');
        newUser.save();
        res.redirect("/start");
    }
    else {
      console.log('Something went wrong while saving data.');
      res.redirect("/start");
    }
  });
});
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}




//Opening and starting our server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
