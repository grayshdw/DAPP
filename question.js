//Dependencies & Requirements
const mongoose = require("mongoose");

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//using other database models
let answer = require(__dirname+ "/answer.js");
console.log(answer);

//questions data base schema
const questionSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "answer"
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment"
  }]
});

//exporting the Schema model
module.exports = mongoose.model("question", questionSchema);
