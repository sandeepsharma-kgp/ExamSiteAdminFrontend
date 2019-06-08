
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

router.get('/uniquetopic/add' , function(req, res)
{
  res.render("topicInput");

});

router.get('/topic/add', function(req, res) {
  res.render("topicDropdown");
});

router.post('/uniquetopic/add' , function(req, res)
{
  var sqlQuery = "SELECT * FROM Topics WHERE topicName = ? LIMIT 1";
  con.query(sqlQuery, [req.body.topicName], function(error, results){
    // There was an issue with the query
    if(error){
      console.log(error);
      return;
    }

    if(results.length){
      // The username already exists
      console.log("Id exists");
        res.render("topicInput", { errorMessage: "Topic already exists!!" });

    }else{
      // The username wasn't found in the database
      console.log("ID doesnt exist");
      db.topic.create({
        topicName: req.body.topicName
      });
        res.render("topicInput", { successMessage: "Topic added successfully!!" });
    }
  });

});

router.get('/topic/update/:id' , function(req, res) {
  res.render("updateTopic");
});

router.get('/api/v1/topic/update/:id', function (req, res) {

  console.log(req.params.id);
  db.topic.findAll({ where: {topicId : req.params.id}}).then(function(data) {
    // console.log(data);
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});


router.post('/topic/update' , function(req, res) {

  // update statment
  var sql = `UPDATE Topics
             SET topicName = ? `;

  var data = [req.body.newtopicName];

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

router.get('/topic/search' , function(req, res)
{
  res.render("searchTopic");

});

// router.post('/topic/search' , function(req, res) {
//
//   // update statment
//   var sql = `SELECT topicName FROM  Topics
//              WHERE topicID = ?`;
//
//   // execute the UPDATE statement
//   con.query(sql, req.body.topicName, function(error, results) {
//     if (error){
//       return console.error(error.message);
//     }
//     console.log(results);
//   });
//   res.redirect("/topic/search");
// });

router.get('/topic/view' , function (req, res)
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
