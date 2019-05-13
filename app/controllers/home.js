
const express = require('express');
const router = express.Router();
const db = require('../models');
const Subject = require('../models/subject');
/* var Question = require('../models/questions'); */

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "Turbo",
  password: "temp12345",
  database: "examsiteadminfrontend_development"
});



module.exports = (app) => {
  app.use('/', router);
};

router.get('/', function(req,res){

  res.render("home", {layout: "homeLayout" });

});


/* router.get('/add', function(req, res)
{
  res.render("addInfo");

});
*/
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


router.get('/subject/read', function(req, res) {
 con.query('SELECT * FROM Subjects', (err,rows) => {
  if(err) throw err;
  console.log(rows);
    res.send(rows);
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

  res.redirect("/subject/read")
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

router.get('/topic/read', function(req, res) {
 con.query('SELECT * FROM Topics', (err,rows) => {
  if(err) throw err;
  console.log(rows);
    res.send(rows);
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

 router.get('/add/questions', function (req, res)
{
  res.render("questions");
});

router.post('/add/questions', function (req, res)
{
  var question = new Question();
      question.Id = req.body.quesID;
      question.ques = req.body.ques;
      question.option1 = req.body.option1;
      question.option2 = req.body.option2;
      question.option3 = req.body.option3;
      question.option4 = req.body.option4;
      questiion.level = req.body.level;
      question.subject = req.body.subject;
      question.topic = req.body.topic;
      question.save();
      res.redirect('/add/questions');
});

router.get('/view', function (req, res)
{

  var quer1 = "SELECT * FROM Subjects";

   con.query(quer1, function(err, rows) {

      if (err) {

          console.log(err);

      }

            console.log(rows);
            res.render("view", {rows : rows});
    });

});

router.get('/view1',function(req,res){


var quer1 = "SELECT * FROM Subjects";
var data = [];

 con.query(quer1, function(err, rows) {

    if (err) {

        console.log(err);


    }
         console.log(rows);
         for(var i= 0; i<rows.length; i++)
         {
          data[i] = [rows[i].subjectID, rows[i].subjectName];
        /*   console.log(data); */
         }
         console.log(data);
  });
        console.log(data);
  // connected! (unless `err` is set)
});

router.get('/api/v1/subject/all', function (req, res) {
  db.subject.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
  });
});
