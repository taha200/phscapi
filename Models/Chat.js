const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Chat = new mongoose.Schema({
  text: {
    type: String,
    // required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  status: {
    type: String
  },
  reply_id: {
    type: String
  },
  video: {
    type: String
  },
  image: {
    type: String
  },
  chatroom_id: {
    type: Schema.Types.ObjectId,
    ref: "chatrooms"
  },
  createdAt: {
    type: String,
    // default: new Date()
  }
});

module.exports = mongoose.model("chats", Chat);
