var express = require("express");
var socket = require("socket.io");
const db = require("./Config");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
var serviceAccount = require("./privateJson.json");
const cors = require("cors");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./socketUser");
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nani-sltz.firebaseio.com",
});
const User = require("./Models/User");

const Chat = require("./Models/Chat");
const ChatRoom = require("./Models/ChatRoom");

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};
var app = express();
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded());
app.use(express.static("public"));
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024, //2MB max file(s) size
    },
  })
);
app.use(bodyParser.json());

app.use(cors());

db.connection
  .once("open", () => console.log("connected to db"))
  .on("error", (err) => console.log("error connecting db -->", err.message));

var server = app.listen(process.env.PORT || 8000, function () {
  console.log("listening for requests on port 8000");
});

// Static files
app.use(express.static("public"));

var io = socket(server);

io.on("connection", (socket) => {
  console.log(
    "made socket connection",
    socket.id,
    socket.handshake.query.userId
  );

  User.findOne({ _id: socket.handshake.query.userId }, (err, data) => {
    if (data) {
      data.status = "Online";
      data.save((user) => {
        io.sockets.emit("user" + socket.handshake.query.userId, data);
      });
    }
  });

  socket.on("user", (status) => {
    console.log("online", status)
    User.findOne({ _id: socket.handshake.query.userId }, (err, data) => {
      if (data) {
        data.status = status ? status : "Online";
        data.save((user) => {
          io.sockets.emit("user" + socket.handshake.query.userId, data);
        });
      }
    });
  })
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.client.id, name, room });
    if (error) return callback({ error: err });
    socket.join(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });
  socket.on("messageRead", (data, callback) => {
    const user = getUser(socket.id);
    if (!user) return;
    // console.log(data, "msdRead?????")
    Chat.findOne({ _id: data }).exec(function (err, msg) {
      if (err) {
        console.log("err", err);
        return;
      }
      msg.status = "Recieved";
      msg.save().then(() => {
        console.log(data, "update");
        io.to(user.room).emit("messageRead", data);
      });
    });

    // callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (!user) return;
    message.createdAt = new Date();
    let chat = new Chat(message);
    chat
      .save()
      .then((data) => {
        Chat.findOne({ _id: data._id })
          .populate("user")
          .exec(function (err, msg) {
            if (err) {
              console.log("err", err);
              return;
            }
            // console.log(msg);
            ChatRoom.findOne({ _id: msg.chatroom_id }, (error, chatRoom) => {
              if (error) {
                console.log("error", error);
                return;
              }
              // console.log(chatRoom, msg.chatRoom_id)
              chatRoom.updatedAt = msg.createdAt;
              chatRoom.save(() => {
                // io.to(user.room).emit("message", msg);
                io.to(user.room).emit("message", msg);
              });
            });
          });
      })
      .catch((err) => {
        console.log("err", err);
      });
    // callback();
  });

  socket.on("get_rooms" + socket.handshake.query.userId, (chatRooms) => {
    console.log("desus");
    ChatRoom.find({
      $and: [
        {
          $or: [
            { client: socket.handshake.query.userId },
            { counsalor: socket.handshake.query.userId },
          ],
        },
      ],
    })
      .sort("-updatedAt")
      .populate("client counsalor") // only return the Persons name
      .exec(function (err, data) {
        socket.emit("get_rooms" + socket.handshake.query.userId, data.data);
      });
  });
  socket.on("userBlocked", (data) => {
    console.log("userBlocked" + data)
      io.sockets.emit("userBlocked" + data, data);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);

    User.findOne({ _id: socket.handshake.query.userId }, (err, data) => {
      if (data) {
        data.status = "Offline";
        data.last_online = new Date();
        data.save((user) => {
          console.log(data);
          io.sockets.emit("user" + socket.handshake.query.userId, data);
        });
      }
    });
    // io.sockets.emit(
    //   "disconnected",
    //   "disconnected",
    //   socket.id,
    //   socket.handshake.query.userId
    // );
  });
});
app.use("/user", require("./Api/User"));
app.use("/chat", require("./Api/Chat"));
app.use("/quiz", require("./Api/Quiz"));

app.get("/send_notification", (req, res) => {
  let { token, title, body } = req.query;

  console.log(token, title, body);
  var payload = {
    notification: {
      title: title,
      body: body,
    },
  };

  var options = {
    priority: "high",
    timetolive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(token, payload, options)
    .then(function (response) {
      console.log("Successfully gone ", response);
    })
    .catch(function (error) {
      console.log("Error While Sending Message", error);
    });
});
app.post("/block_user", (req, res) => {
  // console.log(req.body, "add User");

  User.findOne({ _id: req.body._id })
    .then((data) => {
      data.acc_status = "Blocked";
      data.save().then((user) => {
        res.json(data);
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});
