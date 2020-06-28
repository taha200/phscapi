const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Answer = new mongoose.Schema({
  answer: {
    type: String,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "questions",
  },
  option: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  generatedOn: {
    type: Number,
  },
});

module.exports = mongoose.model("answers", Answer);
