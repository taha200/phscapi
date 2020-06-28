const mongoose = require("mongoose");
const User = new mongoose.Schema({
  sur_name: {
    type: String,
  },
  user_name: {
    type: String,
  },
  status: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  description: {
    type: String,
  },
  auth_key: {
    type: String,
  },
  avatar: {
    type: String,
  },
  last_online: {
    type: String,
  },
  notification_key: {
    type: String,
  },
  user_type: {
    type: String,
  },
  firebase_id: {
    type: String,
  },
  acc_status: {
    type: String,
    default: "Active",
  },
  chat: {
    type: Boolean,
  },
  survey: {
    type: Boolean,
    default: false
  },
  generatedOn: {
    type: Number,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("users", User);
