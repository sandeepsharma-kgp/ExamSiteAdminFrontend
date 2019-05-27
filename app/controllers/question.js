
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


var crypto            = require('crypto');
var LocalStrategy     = require('passport-local').Strategy;
var Store             = require('express-session').Store;
var BetterMemoryStore = require('session-memory-store')(session);

var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
 router.use(session({
    name: 'JSESSION',
    secret: 'nitrkl',
    store:  store,
    resave: true,
    saveUninitialized: true
}));


router.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false})); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
require('../../config/passport')(passport);
router.use(flash());

module.exports = (app) => {
  app.use('/', router);
};

function checkloginstate(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
};

router.get("/question/view", function(req, res){
  res.render("questionView");
});

 router.get('/question/add', function (req, res)
{
  res.render("questionInput");
});

router.post('/question/add', upload.array('uploadImage',12), function (req, res)
{
      console.log(req.files);
      // console.log(req.files[0].path);
      var question = new Question();
      question.uploadImage = req.files.path;
      question.questionID = req.body.questionID;
      question.questionName = req.body.questionName;
      question.option1 = req.body.option1;
      question.option2 = req.body.option2;
      question.option3 = req.body.option3;
      question.option4 = req.body.option4;
      question.level = req.body.level;
      question.subject = req.body.subject;
      question.topic = req.body.topic;
      question.save();
      res.redirect('/question/add');
});

router.get('/question/update/:id', function(req, res){
	res.render('updateQuestion', {question: req.questionID});
});
