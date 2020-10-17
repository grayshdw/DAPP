//Dependencies & Requirements
const mongoose = require("mongoose");

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb://localhost:27017/daneshjooAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//course notes data base Schema
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
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId, ref: "comment"
  }]
});

//exporting noteSchema model
module.exports =  mongoose.model("note", noteSchema);
