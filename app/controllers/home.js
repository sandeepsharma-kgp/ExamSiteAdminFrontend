
const express = require('express');
const router = express.Router();
const db = require('../models');
const mongodb = require('../mongo-models');
const mongoose = require('mongoose');
const Subject = require('../models/subject');
/* var Question = require('../models/questions'); */

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "Turbo",
  password: "temp12345",
  database: "examsiteadminfrontend_development"
});
console.log("Connection created!!");


module.exports = (app) => {
  app.use('/', router);
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
  res.render("questions");
});

// router.post('/question/add', function (req, res)
// {
//   var question = new Question();
//       question.questionID = req.body.quesID;
//       question.questionName = req.body.ques;
//       question.option1 = req.body.option1;
//       question.option2 = req.body.option2;
//       question.option3 = req.body.option3;
//       question.option4 = req.body.option4;
//       questiion.level = req.body.level;
//       question.subject = req.body.subject;
//       question.topic = req.body.topic;
//       question.save();
//       res.redirect('/question/add');
// });

router.post('/question/add', function(req, res)
{
  res.render("questions", { successMessage2: "Question added successfully!!" });

  var sqlQuery = "SELECT * FROM Questions WHERE questionID = ? LIMIT 1";
  con.query(sqlQuery, [questionID], function(error, results){
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
      db.question.create({
        questionID : req.body.questionID,
        questionName : req.body.questionName,
        option1 : req.body.option1,
        option2 : req.body.option2,
        option3 : req.body.option3,
        option4 : req.body.option4,
        level : req.body.level,
        subject : req.body.subject,
        topic : req.body.topic
      });
    }
  });
  res.redirect("question/view");

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
