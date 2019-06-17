
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

var hookJWTStrategy = require('./services/passportStrategy');
// 6: Hook up Passport.
router.use(passport.initialize());

// Hook the passport JWT strategy.
hookJWTStrategy(passport);

// 
// router.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false})); // session secret
// router.use(passport.initialize());
// router.use(passport.session()); // persistent login sessions
// require('../../config/passport')(passport);
// router.use(flash());

module.exports = (app) => {
  app.use('/', router);
};

router.get('/login', function(req, res){
  if(req.query.register != "success")
    res.render('loginPage');
  else
    res.render('loginPage', { successMessage: "You have registered successfully" });
});


router.post("/login", passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/loginfailed',
    failureFlash: true
}), function(req, res, info){
    res.render('loginPage',{'message' : req.flash('message')});
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

router.get('/loginfailed', function(req, res){
	res.render('loginPage',{ errorMessage: req.flash('loginMessage') });
});

router.get('/dashboard', function(req, res){
  console.log(req.user)
	res.render('dashboard', {layout : "homeLayout" , name: req.user.name });
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

router.get("/register", function(req, res){
  res.render("registerPage");

});
router.post("/register", function(req, res){

email = req.body.email;
var sqlQuery = "SELECT * FROM Users WHERE email = ? LIMIT 1";
con.query(sqlQuery, req.body.email, function(error, results){
  // There was an issue with the query
  if(error){
    console.log(error);
    return;
  }

  if(results.length){
    // The username already exists
    console.log("Id exists");
    res.redirect('/registerfailed');

  }else{
    // The username wasn't found in the database
    console.log("ID doesnt exist");
    db.User.create({
      name:  req.body.name,
      email: req.body.email,
      password: req.body.password
        });
        res.redirect('/login?register=success');
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
