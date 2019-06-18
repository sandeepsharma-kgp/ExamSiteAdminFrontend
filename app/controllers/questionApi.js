
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

router.get('/api/v1/question/update/:id', function (req, res) {

  console.log(req.params.id);
  var question = new Question();
  Question.find({_id : req.params.id}, function(err, data) {
    // console.log(data);
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
    // console.log(data);
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
  Question.updateOne({_id: req.body.questionID}, {
    $set:{
    questionName : req.body.questionName,
    option1 :req.body.option1,
    option2 : req.body.option2,
    option3 : req.body.option3,
    option4 : req.body.option4,
    level : req.body.level,
    answerKey : req.body.answerKey,
    solution : req.body.solution
  }}, function(err, result) {
      if (err)
          return err;
    });
    res.send("done");
});

router.post('/api/question/verify' , function(req, res)
{
  data = req.body;
  console.log(data);
  Question.updateOne({questionID: req.body.questionID}, {
    $set:{
    questionName : req.body.questionName,
    option1 :req.body.option1,
    option2 : req.body.option2,
    option3 : req.body.option3,
    option4 : req.body.option4,
    level : req.body.level,
    status : "Verified"   }}, function(err, result) {
      if (err)
          return err;
      });
  res.send("done");
});

router.get('/api/v1/question/delete/:id', function (req, res) {
  var id = req.params.id;
  Question.deleteOne({"_id": id}, (err, results) => {
        if(err)
          console.log(err);
        else {
          console.log("Success");
          res.json(results);
        }
    });

});

router.post('/api/v1/question/search', function(req, res){
  data = req.body;
  console.log(data);
  QuestionID.find({"SID" : data.SID , "topic" : data.topicId}, function(err, results){
    if(err)
      res.send(err);
    else {
      console.log(results);
      // res.json(results);
      // Question.find({"_id" : results[0].})
    }
  })
});
