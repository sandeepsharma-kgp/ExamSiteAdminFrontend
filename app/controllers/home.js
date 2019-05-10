
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
  db.Subject.create({
    subjectID:  req.body.subjectID,
    subjectName: req.body.subjectName,
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
  res.render("update");
  var subjectID = req.body.subjectID;
  con.query(
    'UPDATE subjects SET subjectName = req.body.newsubjectName Where subjectID = req.body.subjectID',
    [req.newsubjectName, req.body.subjectID],
    (err, result) => {
      if (err) throw err;
      }
  );

});


router.get('/topic/add', function(req, res)
{
  res.render("topicInput");

});

router.post('/topic/add', function(req, res)
{
  var topicID= req.body.topicID;
  var topicName= req.body.topicName;
  res.render("topicInput", { successMessage: "Subject added successfully!!" });
  db.topic.create({
    topicId: req.body.topicID,
    topicName: req.body.topicName,
  });

});

router.get('/topic/read', function(req, res) {
 con.query('SELECT * FROM Topics', (err,rows) => {
  if(err) throw err;
  console.log(rows);
    res.send(rows);
});

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
