const express = require("express");
const router = express.Router();

const User = require("../Models/User");
const Review = require("../Models/Review");

router.post("/add_user", (req, res) => {
  console.log(req.body, "add User");
  let user = new User(req.body);

  user
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});

router.post("/block_user", (req, res) => {
  console.log(req.body, "add User");

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

router.post("/un_block_user", (req, res) => {
  console.log(req.body, "add User");

  User.findOne({ _id: req.body._id })
    .then((data) => {
      data.acc_status = "Active";
      data.save().then((user) => {
        res.json(data);
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});

router.post("/update_user", (req, res) => {
  console.log(req.body, "add User");

  User.findOne({ _id: req.body._id })
    .then((data) => {
      data.sur_name = req.body.sur_name;
      data.user_name = req.body.user_name;
      data.description = req.body.description;
      data.notification_key = req.body.notification_key;
      data.avatar = req.body.avatar;
      data.save().then((user) => {
        res.json(user);
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("err", err);
    });
});

router.get("/get_user_admin", (req, res) => {
  console.log(req.query, "get User firebase");
  User.findOne(
    { firebase_id: req.query.firebase_id},
    (err, data) => {
      if (err) {
        console.log("err", err);
        return;
      }
      console.log(data, "get user");
      res.json(data);
    }
  );
});
router.get("/get_user", (req, res) => {
  console.log(req.query, "get User firebase");
  User.findOne(
    { firebase_id: req.query.firebase_id, user_type: req.query.user_type},
    (err, data) => {
      if (err) {
        console.log("err", err);
        return;
      }
      // console.log(data.user_name, "get user");
      res.json(data);
    }
  );
});
router.get("/get_consalor_by_id", (req, res) => {
  console.log(req.body, req.query, "get get_consalor_by_id");
  User.findOne({ _id: req.query._id }, (err, data) => {
    if (err) {
      console.log("err", err);
      return;
    }
    res.json(data);
  });
});
router.get("/get_consalors", (req, res) => {

  User.find({ user_type: "Counsalor", acc_status: "Active" }, (err, data) => {
    if (err) {
      console.log("err", err);
      return;
    }
    console.log(data);
    res.json(data);
  });
});

router.get("/check_if_exists", (req, res) => {
  console.log(req.query, "get counsalro");

  User.findOne({ user_name: req.query.user_name }, (err, data) => {
    if (err) {
      console.log("err", err);
      return;
    }
    console.log(data);
    res.json(data);
  });
});

router.post("/add_review", (req, res) => {
  console.log(req.body, "add Review");
  Review.findOne({
    client: req.body.client,
    counsalor: req.body.counsalor,
  }).then((review) => {
    if (review === null) {
      req.body.generatedOn = new Date().getTime();
      req.body.updatedAt = new Date().getTime();
      let reviews = new Review(req.body);

      reviews
        .save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          console.log("err", err);
          res.status(500).send("err", err);
        });
    } else {
      review.details = req.body.details;
      review.rating = req.body.rating;
      review.updatedAt = new Date().getTime();
      review.save().then(() => {
        res.json(review);
      });
    }
  });
});

router.get("/get_reviews", (req, res) => {
  console.log(req.query, "get counsalro");

  Review.find({ counsalor: req.query.counsalor })
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

router.get("/get_user_reviews", (req, res) => {
  console.log(req.query, "get counsalro");

  Review.find({ client: req.query.client })
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

router.get("/get_counsalors_admin", (req, res) => {
  console.log(req.query, "get counsalro");

  User.find({ user_type: "Counsalor", acc_status: { $ne: "Blocked" } }).exec(
    function (err, data) {
      if (err) {
        console.log("err", err);
        return;
      }
      // console.log(data);
      let main_arr = [];
      data.map((v, i) => {
        Review.find({ counsalor: v._id }).exec(function (error, reviews) {
          if (error) {
            console.log("err", err);
            return;
          } // only return the Persons name
          let aveReview = 0;
          let div = reviews.length;
          reviews.map((val) => {
            aveReview += val.rating;
          });
          data[i].ratings = aveReview / div;
          let obj = { ...data[i], rating: aveReview / div };

          // console.log(obj)
          main_arr.push({ ...obj._doc, rating: obj.rating, ratedBy: div });
          if (main_arr.length === data.length) {
            console.log("asdsa", main_arr[0]);
            res.json(main_arr);
          }
        });
      });
    }
  );
});

router.get("/get_counsalors_admin_blocked", (req, res) => {
  console.log(req.query, "get counsalro");

  User.find({ user_type: "Counsalor", acc_status: "Blocked" }).exec(function (
    err,
    data
  ) {
    if (err) {
      console.log("err", err);
      return;
    }
    // console.log(data);
    let main_arr = [];
    data.map((v, i) => {
      Review.find({ counsalor: v._id }).exec(function (error, reviews) {
        if (error) {
          console.log("err", err);
          return;
        } // only return the Persons name
        let aveReview = 0;
        let div = reviews.length;
        reviews.map((val) => {
          aveReview += val.rating;
        });
        data[i].ratings = aveReview / div;
        let obj = { ...data[i], rating: aveReview / div };

        // console.log(obj)
        main_arr.push({ ...obj._doc, rating: obj.rating, ratedBy: div });
        if (main_arr.length === data.length) {
          console.log("asdsa", main_arr[0]);
          res.json(main_arr);
        }
      });
    });
  });
});
router.get("/get_users_admin", (req, res) => {
  console.log(req.query, "get counsalro");

  User.find(
    { user_type: "Client", acc_status: { $ne: "Blocked" } },
    (err, data) => {
      if (err) {
        console.log("err", err);
        return;
      }
      console.log(data);
      res.json(data);
    }
  );
});

router.get("/get_users_admin_blocked", (req, res) => {
  console.log(req.query, "get User firebase");
  User.find({ user_type: "Client", acc_status: "Blocked" }, (err, data) => {
    if (err) {
      console.log("err", err);
      return;
    }
    console.log(data, "get user");
    res.json(data);
  });
});
router.get("/get_user_admin", (req, res) => {
  console.log(req.query, "get User firebase");
  User.findOne({ _id: req.query._id }, (err, data) => {
    if (err) {
      console.log("err", err);
      return;
    }
    console.log(data, "get user");
    res.json(data);
  });
});
module.exports = router;
