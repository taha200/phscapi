const mongoose = require("mongoose");

const Question = new mongoose.Schema({
  question: {
    type: String,
  },
  option1: {
    type: String,
  },
  option2: {
    type: String,
  },
  option3: {
    type: String,
  },
  option4: {
    type: String,
  },
  status: {
    type: Number,
    default: 0
  },
  generatedOn: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
});

module.exports = mongoose.model("questions", Question);
