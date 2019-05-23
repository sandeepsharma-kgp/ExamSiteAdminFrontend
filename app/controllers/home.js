
const express = require('express');
const router = express.Router();
const db = require('../models');
const config = require('../../config/config');
const mongodb = require('../mongo-models');
const mongoose = require('mongoose');
const fs = require('fs');
var multer = require('multer');
const upload = multer();
const Subject = require('../models/subject');
var Question = require('../mongo-models/index');
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');

var crypto            = require('crypto');
var LocalStrategy     = require('passport-local').Strategy;
var Store             = require('express-session').Store;
var BetterMemoryStore = require('session-memory-store')(session);
var multipart = require('connect-multiparty');

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

mongoose.connect(config.mongodb);
const mongo = mongoose.connection;
mongo.on('error', () => {
  throw new Error('unable to connect to database at ' + config.mongodb);
});

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "examsiteadminfrontend_development"
});
console.log("Connection created!!");


module.exports = (app) => {
  app.use('/', router);
};

// router.get('/login', function(req, res){
//   if(req.query.register != "success")
//     res.render('loginPage');
//   else
//     res.render('loginPage', { successMessage: "You have registered successfully" });
// });
//
// router.post('/login', passport.authenticate('login', {
// 	successRedirect : '/dashboard', // redirect to the secure profile section
// 	failureRedirect : '/loginfailed', // redirect back to the signup page if there is an error
// 	failureFlash : true // allow flash messages
// }));

// router.get('/loginfailed', function(req, res){
// 	res.render('loginPage',{ errorMessage: req.flash('loginMessage') });
// });

router.get('/login', function(req, res){
  res.render('loginPage',{'message' :req.flash('message')});
});

router.post("/login", passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res, info){
    res.render('loginPage',{'message' :req.flash('message')});
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

router.get('/dashboard', function(req, res){
  console.log(req.user)
	res.render('dashboard', {layout : "homeLayout"});
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.get("/register", function(req, res){
  res.render("registerPage");

});
router.post("/register", function(req, res){

var sqlQuery = "SELECT * FROM Users WHERE email = ? LIMIT 1";
con.query(sqlQuery, [email], function(error, results){
  // There was an issue with the query
  if(error){
    console.log(error);
    return;
  }

  if(results.length){
    // The username already exists
    console.log("Id exists");

  }else{
    // The username wasn't found in the database
    console.log("ID doesnt exist");
    db.Users.create({
      name:  req.body.name,
      email: req.body.email,
      password: req.body.password
        });
      }
    });
});

router.get('/registerfailed', function(req, res){
	res.render('registerPage',{ errorMessage: 'User already exists' });
});

function checkloginstate(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
};

router.get('/', function(req,res){
  res.render("home", {layout: "homeLayout" });
});

router.get('/subject/add', function(req, res)
{
  res.render("subjectInput");

});

router.post('/subject/add', function(req, res)
{

  res.render("subjectInput", { successMessage: "Subject added successfully!!" });
  var subjectID = req.body.subjectID; // This will come from your signup form

var sqlQuery = "SELECT * FROM Subjects WHERE subjectID = ? LIMIT 1";
con.query(sqlQuery, [subjectID], function(error, results){
  // There was an issue with the query
  if(error){
    console.log(error);
    return;
  }

  if(results.length){
    // The username already exists
    console.log("Id exists");

  }else{
    // The username wasn't found in the database
    console.log("ID doesnt exist");
    db.Subject.create({
      subjectID:  req.body.subjectID,
      subjectName: req.body.subjectName,
    });
  }
});
});

router.get('/question/view', function(req, res) {
  res.render("questionView");
});


router.get('/subject/update', function(req, res) {
  res.render("updateSubject");
});


router.post('/subject/update', function(req, res) {

  // update statment
  var sql = `UPDATE Subjects
             SET subjectName = ?
             WHERE subjectID = ?`;

  var data = [req.body.newsubjectName, req.body.subjectID];

  // execute the UPDATE statement
  con.query(sql, data, (error, results) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    console.log(results);
  });

  res.redirect("/subject/view")
});

router.get('/subject/search', function(req, res)
{
  res.render("searchSubject");

});

router.post('/subject/search', function(req, res) {

  // update statment
  var sql = `SELECT subjectName FROM  Subjects
             WHERE subjectID = ?`;

  // execute the UPDATE statement
  con.query(sql, req.body.subjectID, function(error, results) {
    if (error){
      return console.error(error.message);
    }
    console.log(results);
  });
  res.redirect("/subject/search");
});


router.get('/topic/add', function(req, res)
{
  res.render("topicInput");

});

router.post('/topic/add', function(req, res)
{
  var topicID= req.body.topicID;
  var topicName= req.body.topicName;
  res.render("topicInput", { successMessage1: "Topic added successfully!!" });

  var sqlQuery = "SELECT * FROM Topics WHERE topicID = ? LIMIT 1";
  con.query(sqlQuery, [topicID], function(error, results){
    // There was an issue with the query
    if(error){
      console.log(error);
      return;
    }

    if(results.length){
      // The username already exists
      console.log("Id exists");

    }else{
      // The username wasn't found in the database
      console.log("ID doesnt exist");
      db.topic.create({
        topicId: req.body.topicID,
        topicName: req.body.topicName,
      });
    }
  });

});

router.get('/topic/update', function(req, res) {
  res.render("updateTopic");
});


router.post('/topic/update', function(req, res) {

  // update statment
  var sql = `UPDATE Topics
             SET topicName = ?
             WHERE topicID = ?`;

  var data = [req.body.newtopicName, req.body.topicID];

  // execute the UPDATE statement
  con.query(sql, data, (error, results) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    console.log(results);
    res.redirect("/topic/update")
  });
});


router.get('/topic/update', function(req, res) {
  res.render("updateTopic");
});


router.post('/topic/update', function(req, res) {

  // update statment
  var sql = `UPDATE Topics
             SET topicName = ?
             WHERE topicID = ?`;

  var data = [req.body.newtopicName, req.body.topicID];

  // execute the UPDATE statement
  con.query(sql, data, (error, results) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    console.log(results);
  });

});


router.get('/topic/search', function(req, res)
{
  res.render("searchTopic");

});

router.post('/topic/search', function(req, res) {

  // update statment
  var sql = `SELECT topicName FROM  Topics
             WHERE topicID = ?`;

  // execute the UPDATE statement
  con.query(sql, req.body.topicID, function(error, results) {
    if (error){
      return console.error(error.message);
    }
    console.log(results);
  });
  res.redirect("/topic/search");
});

 router.get('/question/add', function (req, res)
{
  res.render("questionInput");
});

router.get('/api/v1/question/all', function (req, res) {
  console.log('1');
  Question.find(function(err, result) {
    console.log('1');
    console.log(err);
   res.json(result);
 })
});

router.post('/question/add',function (req, res)
{
  question.uploadImage = fs.readFileSync(req.files.uploadImage.path);
  console.log(req.files);
  var question = new Question();
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

router.get('/question/view/:id', function(req, res){
	res.render('updateQuestion', {question: req.questionID});
});

router.put('/question/view/:id', function(req, res){
	question.update({_id: req.params.questionID},
	                   {
			   	  questionID    : req.body.name,
				    questionName  : req.body.age,
            option1    : req.body.newoption1,
            option2    : req.body.newoption2,
            option3    : req.body.newoption3,
            option4    : req.body.newoption4,
            level    : req.body.level,
            subject    : req.body.subject,
            topic    : req.body.topic
			   }, function(err, docs){
			 	if(err) res.json(err);
				else    res.redirect('/user/'+req.params.id);
			 });
});

router.param('questionID', function(req, res, next, id){
	question.findById(id, function(err, docs){
			if(err) res.json(err);
			else
			{
				req.questionID = docs;
				next();
			}
		});
});

router.get('/subject/view', function (req, res)
{
  var quer1 = "SELECT * FROM Subjects";
  con.query(quer1, function(err, rows) {
  if (err) {
    console.log(err);
  }
    console.log(rows);
    res.render("subjectView");
    });

});

router.get('/topic/view', function (req, res)
{
  var quer2 = "SELECT * FROM Topics";
  con.query(quer2, function(err, rows) {
  if (err) {
    console.log(err);
  }
    console.log(rows);
    res.render("topicView");
    });

});

router.get('/api/v1/subject/all', function (req, res) {
  db.subject.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.get('/api/v1/subject/delete/:id', function (req, res) {
  var id = req.params.id;
  db.subject.destroy({ where: {
      subjectID: id //this will be your id that you want to delete
   }}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
         console.log('Deleted successfully');
       }
       console.log(rowDeleted);
    }, function(err){
        console.log(err);
        return;
    });

});

router.get('/api/v1/topic/all', function (req, res) {
  db.topic.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
      res.status(400).json({ error: err })
  });
});

router.get('/api/v1/topic/delete/:id', function (req, res) {
  var id = req.params.id;
  db.topic.destroy({ where: {
      topicId: id //this will be your id that you want to delete
   }}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
         console.log('Deleted successfully');
       }
       console.log(rowDeleted);
    }, function(err){
        console.log(err);
        return;
    });

});

router.get('/api/v1/question/delete/:id', function (req, res) {
  var id = req.params.id;
  db.question.destroy({ where: {
      questionID: id //this will be your id that you want to delete
   }}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
         console.log('Deleted successfully');
       }
       console.log(rowDeleted);
    }, function(err){
        console.log(err);
        return;
    });

});
