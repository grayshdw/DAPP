
//Dependencies & Requirements
const mongoose = require("mongoose");

//using other database models
let question = require(__dirname+ "/question.js");
let note = require(__dirname+ "/note.js");

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//Comments Schema
const commentSchema = new mongoose.Schema ({
  commenter: {
    type: mongoose.Schema.Types.ObjectId, ref: "user",
    required: true
  },
  context: {
    type: String,
    required: true
  },
  respond: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  likes: {
    type: Number
  },
  itemQ: {
    type: mongoose.Schema.Types.ObjectId, ref: "question"
  },
  itemN: {
    type: mongoose.Schema.Types.ObjectId, ref: "note"
  }
});

//exporting the commentSchema model
module.exports = mongoose.model("comment", commentSchema);
