//Dependencies & Requirements
const mongoose = require("mongoose");

//using other database models
let question = require(__dirname+ "/question.js");
let note = require(__dirname+ "/note.js");
let cooment = require(__dirname+ "/comment.js")

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

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
    type: String,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  questionsDown: [{
    type: mongoose.Schema.Types.ObjectId, ref: "question"
  }],
  notesDown: [{
    type: mongoose.Schema.Types.ObjectId, ref: "note"
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId, ref: "comment"
  }]
});

//exporting the userSchema model
module.exports = mongoose.model("user",userSchema);
