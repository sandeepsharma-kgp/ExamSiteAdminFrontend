
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

router.get('/api/v1/subject/update/:id', function (req, res) {

  console.log(req.params.id);
  db.subject.findAll({ where: {SID : req.params.id}}).then(function(data) {
    // console.log(data);
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.post('/api/subject/update' , function(req, res)
{
  data = req.body;
  console.log(data);
  var subject = [data.SID, data.subjectName, data.SID];
  console.log(subject);
  console.log(data.SID);
  console.log(data.subjectName);
  var sqlQuery = "UPDATE Subjects SET SID = ?, subjectName = ? WHERE SID = ?;";
  con.query(sqlQuery, subject, function(error, results){
    // There was an issue with the query
    if(error){
      console.log(error);
      return;
    }

    if(results.length){
      // The username already exists
      console.log("Updated");
    }
  });
  res.send("done");
});

router.get('/api/v1/subject/all' , function (req, res) {
  db.subject.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.get('/api/v1/subject/delete/:id' , function (req, res) {
  var id = req.params.id;
  db.subject.destroy({ where: {
      SID: id //this will be your id that you want to delete
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
