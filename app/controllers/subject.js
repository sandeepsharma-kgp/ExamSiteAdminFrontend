
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

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

router.get('/subject/add',isAuthenticated , function(req, res)
{
  res.render("subjectInput");

});
//
// router.post('/subject/add',isAuthenticated , function(req, res)
// {
//   db.Subject.findAll({where : {name : req.body.name}})
//   console.log(req.body.class);
//   var boardInitials = req.body.board.substring(0,4);
//   var new2 = boardInitials.concat(req.body.class);
//   var new4 = req.body.subjectName.substring(0,4);
//   var new5 = new4.toUpperCase();
//   console.log(new5);
//   var new3 = new2.concat(new5);
//   console.log(new3);
//   var sqlQuery = "SELECT * FROM Subjects WHERE SID = ? LIMIT 1";
//   con.query(sqlQuery, [new3], function(error, results){
//   // There was an issue with the query
//     if(error){
//     console.log(error);
//     return ;
//     }
//
//     if(results.length){
//     // The username already exists
//       console.log("Id exists");
//         res.render("subjectInput", { errorMessage: "Subject already exists with SID "+ new3});
//
//     }else{
//     // The username wasn't found in the database
//       console.log("ID doesnt exist");
//         db.Subject.create({
//           subjectName: req.body.subjectName,
//           class: req.body.class,
//           board: req.body.board,
//           SID : new3
//         });
//       res.render("subjectInput", { successMessage: "Subject is added successfully with SID " + new3});
//       }
//       });
// });


router.get('/subject/update/:id' , function(req, res) {
  res.render("updateSubject");
});

router.post('/subject/update',isAuthenticated , function(req, res) {

  // update statment
  var sql = `UPDATE Subjects
             SET subjectName = ?
             WHERE SID = ?`;

  var data = [req.body.newsubjectName, req.body.SID];

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

router.get('/subject/search',isAuthenticated , function(req, res)
{
  res.render("searchSubject");

});

router.post('/subject/search',isAuthenticated , function(req, res) {

  // update statment
  var sql = `SELECT subjectName FROM  Subjects
             WHERE SID = ?`;

  // execute the UPDATE statement
  con.query(sql, req.body.SID, function(error, results) {
    if (error){
      return console.error(error.message);
    }
    console.log(results);
  });
  res.redirect("/subject/search");
});

router.get('/subject/view' , function (req, res)
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
