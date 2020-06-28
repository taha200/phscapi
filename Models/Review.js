const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new mongoose.Schema({
  counsalor: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
  },
  generatedOn: {
    type: Number,
    // default: new Date().getTime(),
  },
  updatedAt: {
    type: Number,
    // default: new Date().getTime(),
  },
});

module.exports = mongoose.model("reviews", Review);
