//Dependencies & Requirements
const mongoose = require("mongoose");

//using other database models
let question = require(__dirname+ "/question.js");

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//Answers data base Schema
const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question"
  }
});

//exporting the answerSchema model
module.export = new mongoose.model("answer", answerSchema);
