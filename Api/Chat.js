const express = require("express");
const router = express.Router();
const User = require("../Models/User");

const Chat = require("../Models/Chat");
const ChatRoom = require("../Models/ChatRoom");

router.get("/chat_data", (req, res) => {
  Chat.find({ chatroom_id: req.query.chatroom_id })
    .sort("-createdAt")
    .populate("user")
    .exec(function (err, data) {
      if (err) {
        console.log("err", err);
        return;
      }
      res.json(data);
    });
});

router.post("/add_chatroom", (req, res) => {
  console.log(req.body, "add chatroom");
  let chatRoom = new ChatRoom(req.body);

  chatRoom
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});

router.get("/get_room_data", (req, res) => {
  console.log(req.query, "get ChatRoom");
  ChatRoom.findOne({ client: req.query.client, counsalor: req.query.counsalor })
    .populate("client counsalor") // only return the Persons name
    .exec(function (err, roomData) {
      if (err) {
        console.log("err", err);
        return;
      }
      if (roomData) {
        res.json(roomData);
        return;
      }
      User.findOne({ _id: req.query.client }, (err, client) => {
        if (err) {
          console.log("err", err);
          return;
        }
        return User.findOne(
          { _id: req.query.counsalor },
          (error, counsalor) => {
            if (error) {
              console.log("error", error);
              return;
            }

            res.json({ client: client, counsalor: counsalor });
          }
        );
      });
    });
});

router.get("/get_room_by_id", (req, res) => {
  // console.log(req.query, "get ChatRoom by id");
  ChatRoom.findOne({ _id: req.query._id })
    .populate("client counsalor") // only return the Persons name
    .exec(function (err, data) {
      if (err) {
        console.log("err", err);
        return;
      }
      res.json(data);
    });
});

router.get("/get_my_rooms", (req, res) => {
  console.log(req.query, "get counsalro");

  ChatRoom.find({
    $and: [{ $or: [{ client: req.query._id }, { counsalor: req.query._id }] }],
  })
    .sort("-updatedAt")
    .populate("client counsalor") // only return the Persons name
    .exec(function (err, data) {
      if (err) {
        console.log("err", err);
        return;
      }
      console.log(data);
      res.json(data);
    });
});

module.exports = router;
