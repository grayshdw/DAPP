//Dependencies & Requirements
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();




//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');

//Using bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Adding public folder as a static source of our project
app.use(express.static("public"));

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});




//Sample questions data base schema
const questionSchema=new mongoose.Schema({
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
  },
  answer: {
    type: String
  }
});
//Creating the sample questions schema document
const question = mongoose.model("question",questionSchema);


//Answers data base Schema
const answerSchema = new mongoose.Schema({
  question: {
    type: questionSchema
  }
});
//Creating the sample answers schema document
const answer = new mongoose.model("answer", answerSchema);

//Adding answer field to sampleQSchema
question.updateMany({}, {answer: answer}, function(err) {
    if (err)
      console.log(err);
});

//course notes  data base Schema
const noteSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    //rating method for our Course note 1 is the worst and 5 is the best
    min: 1,
    max: 5
  },
  downloadedCount: {
    type:Number
  },
  price: {
    type: Number,
    min: 0
  }
});
//Creating the sample questions schema document
const note =  mongoose.model("note", noteSchema);

//User data base schema
const userSchema = new mongoose.Schema({
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
  username: {
    type: String
  },
  questionsDown: [questionSchema]
});
//Creating the user document
const user = mongoose.model("user",userSchema);




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
  let link = req.params.itemID;
  let q = question.find({"_id": link}, function(err, q) {
    res.render("itemDetail", {item: q});
  });
});

//Buying a note page
app.get("/buyN/:itemID", function(req, res) {
  let link = req.params.itemID;
  let n = note.find({"_id": link}, function(err, n) {
    res.render("itemDetail", {item: n});
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

//Course Note uploading form Data
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




//Opening and starting our server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
