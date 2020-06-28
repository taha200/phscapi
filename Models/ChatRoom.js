const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoom = new mongoose.Schema({
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
  generatedOn: {
    type: Number,
    default: new Date().getTime(),
  },
  updatedAt: {
    type: String,
  },
});

module.exports = mongoose.model("chatrooms", ChatRoom);
