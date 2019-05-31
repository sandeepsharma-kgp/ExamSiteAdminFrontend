
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
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');

var crypto            = require('crypto');
var LocalStrategy     = require('passport-local').Strategy;


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null , './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = function(req,file,cb) {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
  cb(null, true);
  else {
    cb(console.log("Unsupported format"), false);
  }
}

var upload = multer({
  storage: storage,
  limits : {fileSize: 1024*1024*5},
  fileFilter : fileFilter
});

router.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false})); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
require('../../config/passport')(passport);
router.use(flash());

module.exports = (app) => {
  app.use('/', router);
};

router.get('/api/v1/question/all', function (req, res) {
  console.log('1');
  Question.find(function(err, result) {
    console.log('1');
    console.log(err);
   res.json(result);
 });
});


router.post('api/v1/question/add', upload.array('uploadImage',12), function (req, res)
{     console.log("working");
      var data = req.body;
      console.log(data);
      // console.log(req.files);
      // // console.log(req.files[0].path);
      // var question = new Question();
      // question.questionID = req.body.questionID;
      // question.questionName = req.body.questionName;
      // question.option1 = req.body.option1;
      // // if(req.files[0].path.length)
      // // question.option1Image = req.files[0].path;
      // question.option2 = req.body.option2;
      // // if(req.files[1].path.length)
      // // question.option2Image = req.files[1].path;
      // question.option3 = req.body.option3;
      // // if(req.files[2].path.length)
      // // question.option3Image = req.files[2].path;
      // question.option4 = req.body.option4;
      // // if(req.files[3].path.length)
      // // question.option4Image = req.files[3].path;
      // question.level = req.body.level;
      // question.subject = req.body.subject;
      // question.topic = req.body.topic;
      // // if(req.files[4].path.length)
      // // // question.Image = req.files[4].path;
      // question.solution = req.body.solution;
      // // question.solutionImage = req.files[5].soltuionImage;
      // question.status = "Skipped";
      // question.answerKey = [req.body.answerKey1, req.body.answerKey2, req.body.answerKey3, req.body.answerKey4];
      // var filtered = question.answerKey.filter(function (el) {
      //   return el != null;
      // });
      //
      // console.log(filtered);
      // question.answerKey = filtered;      //removed null values in array
      // question.save();
      //
      // console.log(question);
      // res.redirect('/question/add');
});



router.get('/api/v1/question/update/:id', function (req, res) {

  console.log(req.params.id);
  var question = new Question();
  Question.find({questionID : req.params.id}, function(err, data) {
    console.log(data);
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.get('/api/v1/question/dropdown/:id', function (req, res) {

  console.log(req.params.id);
  var question = new Question();
  Question.find({questionID : req.params.id}, function(err, data) {
    console.log(data);
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.post('/api/question/update' , function(req, res)
{
  data = req.body;
  console.log(data);
  Question.update({questionID: req.body.questionID}, {
    $set:{ questionID : req.body.questionID,
    questionName : req.body.questionName,
    option1 :req.body.option1,
    option2 : req.body.option2,
    option3 : req.body.option3,
    option4 : req.body.option4,
    level : req.body.level,
    subject : req.body.subject,
    topic : req.body.topic }}, function(err, result) {
      if (err)
          return err;
      });
  res.send("done");
});

router.post('/api/question/verify' , function(req, res)
{
  data = req.body;
  console.log(data);
  Question.update({questionID: req.body.questionID}, {
    $set:{ questionID : req.body.questionID,
    questionName : req.body.questionName,
    option1 :req.body.option1,
    option2 : req.body.option2,
    option3 : req.body.option3,
    option4 : req.body.option4,
    level : req.body.level,
    subject : req.body.subject,
    topic : req.body.topic,
    status : req.body.status    }}, function(err, result) {
      if (err)
          return err;
      });
  res.send("done");
});

router.get('/api/v1/question/delete/:id', function (req, res) {
  var id = req.params.id;
  Question.deleteOne({"questionID": id}, (err, results) => {
        if(err)
          console.log(err);
        else {
          console.log("Success");
        }
    });

});
