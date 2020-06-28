const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Quiz = require("../Models/Question");
const Answer = require("../Models/Anwser");
router.get("/get_current_quiz", (req, res) => {
  Quiz.find({ status: 0 }).exec(function (err, data) {
    if (err) {
      console.log("err", err);
      return;
    }
    res.json(data);
  });
});

router.get("/get_history_quiz", (req, res) => {
  Quiz.find({ status:1 }).exec(function (err, data) {
    if (err) {
      console.log("err", err);
      return;
    }
    res.json(data);
  });
});
router.get("/get_quiz_details", (req, res) => {
  Quiz.findOne({ _id: req.query._id }).exec(function (err, data) {
    if (err) {
      console.log("err", err);
      return;
    }
    res.json(data);
  });
});
router.post("/add_quiz", (req, res) => {
  console.log(req.body, "add quiz");
  let quiz = new Quiz(req.body);

  quiz
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});

router.post("/update_quiz", (req, res) => {
  console.log(req.body, "add quiz");
  Quiz.findOne({ _id: req.body._id }, (err, quiz) => {
    if (err) {
      console.log("err", err);
      return;
    }
    quiz.question = req.body.question;
    quiz.option1 = req.body.option1;
    quiz.option2 = req.body.option2;
    quiz.option3 = req.body.option3;
    quiz.option4 = req.body.option4;
    quiz.status = req.body.status;
    quiz
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send("err", err);
      });
  });
});

router.post("/submit_anwsers", (req, res) => {
  console.log(req.body, "add quiz")
  req.body.anwser.map((v, i) => {
    let answer = new Answer(v);

    answer
      .save()
      .then((data) => {
        if (i === req.body.anwser.length - 1) {
          User.findOne({ _id: v.user }, (err, user) => {
            if(err) {
              console.log(err.message, "error")
              return;
            }
            console.log(user, "hia", v.user)
            user.survey = true;
            user.save().then((user) => {
              console.log("ok")
              res.json(data);
            });
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send("err", err);
      });
  });
});

router.get("/get_anwser", (req, res) => {
  Answer.find({ question: req.query.question }).exec(function (err, data) {
    if (err) {
      console.log("err", err);
      return;
    }
    res.json(data);
  });
});

router.post("/deactivate_quiz", (req, res) => {
  console.log(req.body, "add User");

  Quiz.findOne({ _id: req.body._id })
    .then((data) => {
      data.status = 1;
      data.save().then((user) => {
        res.json(data);
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});

router.post("/activate_quiz", (req, res) => {
  console.log(req.body, "add User");

  Quiz.findOne({ _id: req.body._id })
    .then((data) => {
      data.status = 0;
      data.save().then((user) => {
        res.json(data);
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});


module.exports = router;
