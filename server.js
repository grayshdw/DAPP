//Dependencies & Requirements
const express=require("express");
const bodyParser=require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");
const app=express();

//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');


//Using bodyParser
app.use(bodyParser.urlencoded({extended: true}));


//Adding public folder as a static source of our project
app.use(express.static("public"));

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false,useCreateIndex: true, });

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
  },
  answer:{
    type:SampleA
  }
});

//Creating the sample questions schema document
const SampleQ = mongoose.model("SampleQ",sampleQSchema);

//Answers data base Schema
const sampleASchema = new mongoose.Schema({
  question: {
    type: SampleQ
  }
});

//Creating the sample answers schema document
const SampleA = new mongoose.model("SampleA", sampleASchema);

//course notes  data base Schema

const courseNoteSchema = new mongoose.Schema({
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
  rating:{
    type:Number,
    //rating method for our Course note 1 is the worst and 5 is the best
    min:1,
    max:5
  },
  downloadedCount:{
    type:Number
  },
  price:{
    type:Number,
    min:0
  }
});

//Creating the sample questions schema document
const CourseNote =  mongoose.model("CourseNote",courseNoteSchema);

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


//Creating the user document
const User=mongoose.model("User",usersSchema);




//landing page
app.get("/",function(req,res){
  res.render("main");
});

//start page
app.get("/start",function(req,res){
  res.render("start");

});
//uploading page
app.get("/upload",function(req,res){
  res.render("upload");

});
//List of Notes page
app.get("/notes",function(req,res){
  let notes = CourseNote.find({},function(err,notesData){

    res.render("notes",{notesDataList:notesData});
  });

});
//List of questions page
app.get("/questions",function(req,res){
  let notes = SampleQ.find({},function(err,questionsData){

    res.render("questions",{questionsDataList:questionsData});
  });

});
//Question uploading form Data
app.post("/uploadQuestion",function(req,res){
  const qLessonName = req.body.qLessonName;
  const qSubject = req.body.qSubject;
  const qUniversity = req.body.qUniversity;
  const newQuestion = new SampleQ({
    lesson:qLessonName,
    subject:qSubject,
    university:qUniversity
  });
  newQuestion.save();
  res.redirect("/upload");
});
//Course Note uploading form Data
app.post("/uploadNote",function(req,res){
  const nLessonName = req.body.nLessonName;
  const nSubject = req.body.nSubject;
  const nUniversity = req.body.nUniversity;
  const newNote = new CourseNote({
    lesson:nLessonName,
    subject:nSubject,
    university:nUniversity
  });
  newNote.save();
  res.redirect("/upload");
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
