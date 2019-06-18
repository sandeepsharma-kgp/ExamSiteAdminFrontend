const express = require('express');
const router = express.Router();
const db = require('../models');
const config = require('../../config/config');
const mongodb = require('../mongo-models');
const mongoose = require('mongoose');
const fs = require('fs');
var con = require('../../config/db')
var multer = require('multer');
const Subject = require('../models/subject');
var Question = require('../mongo-models/index');
var QuestionID = require('../mongo-models/questionId');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = function(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true);
  else {
    cb(console.log("Unsupported format"), false);
  }
}

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var Store = require('express-session').Store;
var BetterMemoryStore = require('session-memory-store')(session);

var store = new BetterMemoryStore({
  expires: 60 * 60 * 1000,
  debug: true
});
router.use(session({
  name: 'JSESSION',
  secret: 'nitrkl',
  store: store,
  resave: true,
  saveUninitialized: true
}));


router.use(session({
  secret: 'nitrkl',
  saveUninitialized: false,
  resave: false
})); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
require('../../config/passport')(passport);
router.use(flash());

module.exports = (app) => {
  app.use('/', router);
};

function checkloginstate(req, res, next) {

  if (!req.isAuthenticated() ) {
    res.redirect('/login');
  }
};

router.get("/question/view", function(req, res) {
  res.render("questionView");
});

router.get('/question/add', function(req, res) {
  res.render("questionInput2");
});

var field = [{
  name: 'quesImage',
  maxCount: 1
}, {
  name: 'option1Image',
  maxCount: 1
}, {
  name: 'option2Image',
  maxCount: 1
}, {
  name: 'option3Image',
  maxCount: 1
}, {
  name: 'option4Image',
  maxCount: 1
}, {
  name: 'solImage',
  maxCount: 1
}];

router.post('/question/add', upload.fields(field), function(req, res) {
  var question = new Question();
  console.log(req.body, "heaed body");
  Question.find({
    _id: req.body.questionId
  }, function(err, data) {
    if (err)
      console.log(err);
    else if (data.length) {
      console.log("if data from question again");
      if (data[0].SID == req.body.sid) {
        console.log(data[0].SID);
        console.log(req.body.sid);
        if (data[0].topicId.indexOf(req.body.topic1) != -1) {
          if (req.body.check == "update")
            res.render('questionInput', {
              errorMessage: "Question already exists to SID " + req.body.sid,
              question: data[0]
            });

          else
            res.render('questionInput2', {
              errorMessage: "Question already exists to SID " + req.body.sid
            });
        } else {
          Question.updateOne({
            _id: req.body.questionId
          }, {
            $push: {
              "topicId": req.body.topic1
            }
          }, function(err, result) {
            if (err)
              return err;
            console.log("updated again");
            console.log(result);
            if (req.body.check == "update")
              res.render('questionInput', {
                successMessage: "Question added successfully to SID " + req.body.sid,
                question: data[0]
              });

            else
              res.render('questionInput2', {
                successMessage: "Question added successfully to SID " + req.body.sid
              });
            var ques = new QuestionID();
            QuestionID.find({
              SID: req.body.sid,
              topic: req.body.topic1
            }, function(err, data) {
              if (err)
                console.log(err);
              else if (data.length) {
                console.log(data);
                QuestionID.updateOne({
                  SID: req.body.sid,
                  topic: req.body.topic1
                }, {
                  $push: {
                    "questionId": req.body.questionId
                  }
                }, function(err, result) {
                  if (err)
                    return err;
                  console.log(result);
                });
              } else {
                ques.questionId = req.body.questionId;
                console.log("SID from ques", req.body.sid);
                console.log("topicId from ques", req.body.topic1);
                ques.topic = req.body.topic1;
                ques.SID = req.body.sid;
                ques.save();
                console.log("done");
              }
            });
          });

        }
      } else {
        question.questionName = data[0].questionName;
        question.option1 = data[0].option1;
        question.imagePath = data[0].imagePath;
        question.option2 = data[0].option2;
        question.option3 = data[0].option3;
        question.option4 = data[0].option4;
        question.level = data[0].level;
        question.subject = data[0].subject;
        question.solution = data[0].solution;
        question.status = "Skipped";
        question.SID = req.body.sid;
        question.topicId[0] = req.body.topic1;
        question.answerKey = data[0].answerKey;
        console.log("hello");
        console.log(question), "from question";
        question.save();
        if (req.body.check == "update")
          res.render('questionInput', {
            successMessage: "Question added successfully to SID " + req.body.sid,
            question: data[0]
          });

        else
          res.render('questionInput2', {
            successMessage: "Question added successfully to SID " + req.body.sid
          });
        var ques = new QuestionID();
        QuestionID.find({
          SID: req.body.sid,
          topic: req.body.topic1
        }, function(err, data) {
          if (err)
            console.log(err);
          else if (data.length) {
            console.log(data);
            QuestionID.updateOne({
              SID: req.body.sid,
              topic: req.body.topic1
            }, {
              $push: {
                "questionId": question._id
              }
            }, function(err, result) {
              if (err)
                return err;
              console.log(result, "from sid");
            });
          } else {
            console.log(question._id);
            ques.questionId = question._id;
            console.log("SID from ques", req.body.sid);
            console.log("topicId from ques", req.body.topic1);
            ques.topic = req.body.topic1;
            ques.SID = req.body.sid;
            ques.save();
            console.log("done");
          }
        });
      }
    } else {

      console.log("body ", req.body);
      var quesImage, option1Image, option2Image, option3Image, option4Image, solImage;
      try {
        quesImage = req.files['quesImage'][0].path;
      } catch (e) {
        quesImage = null;
      } finally {
        // QUESTION
        question.imagePath[0] = quesImage;
      }
      try {
        option1Image = req.files['option1Image'][0].path;
      } catch (e) {
        option1Image = null;
      } finally {
        question.imagePath[1] = option1Image;
      }
      try {
        option2Image = req.files['option2Image'][0].path;
      } catch (e) {
        uploadImage1 = null;
      } finally {
        question.imagePath[2] = option2Image;
      }
      try {
        option3Image = req.files['option3Image'][0].path;
      } catch (e) {
        optiion3Image = null;
      } finally {
        question.imagePath[3] = option3Image;
      }
      try {
        option4Image = req.files['option4Image'][0].path;
      } catch (e) {
        option4Image = null;
      } finally {
        question.imagePath[4] = option4Image;
      }
      try {
        solImage = req.files['solImage'][0].path;
      } catch (e) {
        solImage = null;
      } finally {
        question.imagePath[5] = solImage;
      }
      if (question.imagePath == null)
        question.imagePath = req.body.imagePath;
      question.questionName = req.body.questionName;
      question.option1 = req.body.option1;
      question.option2 = req.body.option2;
      question.option3 = req.body.option3;
      question.option4 = req.body.option4;
      question.level = req.body.level;
      question.subject = req.body.subject;
      question.solution = req.body.solution;
      question.status = "Skipped";
      question.SID = req.body.sid;
      question.topicId[0] = req.body.topic1;
      question.answerKey = [req.body.answerKey1, req.body.answerKey2, req.body.answerKey3, req.body.answerKey4];
      var filtered = question.answerKey.filter(function(el) {
        return el != null;
      });
      console.log(filtered);
      question.answerKey = filtered; //removed null values in array
      console.log(question);
      console.log(question._id);
      question.save();
      var ques = new QuestionID();
      QuestionID.find({
        SID: req.body.sid,
        topic: req.body.topic1
      }, function(err, data) {
        if (err)
          console.log(err);
        else if (data.length) {
          console.log(data);
          QuestionID.updateOne({
            SID: req.body.sid,
            topic: req.body.topic1
          }, {
            $push: {
              "questionId": question._id
            }
          }, function(err, result) {
            if (err)
              return err;
            console.log(result);
          });
        } else {
          console.log(question._id);
          ques.questionId = question._id;
          console.log("SID from ques", req.body.sid);
          console.log("topicId from ques", req.body.topic1);
          ques.topic = req.body.topic1;
          ques.SID = req.body.sid;
          ques.save();
          console.log("done");
        }
      });


      if (req.body.check == "update")
        res.render('questionInput', {
          successMessage: "Question added successfully to SID " + req.body.sid,
          question: question
        });

      else
        res.render('questionInput2', {
          successMessage: "Question added successfully to SID " + req.body.sid
        });
    }
  });


});

router.get('/question/search', function(req, res){
  res.render("questionSearch");
});


router.get('/question/update/:id', function(req, res) {
  res.render('updateQuestion', {
    question: req.questionID
  });
});

router.get('/question/verify/:id', function(req, res) {
  res.render('verifyQues', {
    question: req.questionID
  });
});

router.get('/question/preview/:id', function(req, res) {
  res.render('questionPreview', {
    question: req.questionID
  });
});
