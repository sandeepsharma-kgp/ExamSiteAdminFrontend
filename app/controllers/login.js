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
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt');

// 6: Hook up Passport.
router.use(passport.initialize());


//
// router.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false})); // session secret
// router.use(passport.initialize());
// router.use(passport.session()); // persistent login sessions
// require('../../config/passport')(passport);
// router.use(flash());

module.exports = (app) => {
  app.use('/', router);
};

router.get('/login', function(req, res) {
  if (req.query.register != "success")
    res.render('loginPage');
  else
    res.render('loginPage', {
      successMessage: "You have registered successfully"
    });
});


router.post("/login", passport.authenticate('login', {
  successRedirect: '/dashboard',
  failureRedirect: '/loginfailed',
  failureFlash: true
}), function(req, res, info) {
  res.render('loginPage', {
    'message': req.flash('message')
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    if(req.user.roleId == 2|| req.user.roleId == 3)
      return next();
  }
  res.redirect('/login');
}


function isAuthenticatedAdmin(req, res, next) {
  if (req.isAuthenticated()){
    if(req.user.roleId == 3)
      return next();
  }
  res.redirect('/login');
}

router.get('/loginfailed', function(req, res, authorizedStatus) {
  res.render('loginPage', {
    errorMessage: req.flash('loginMessage')
  });
});

router.get('/dashboard',isAuthenticated, function(req, res) {
  console.log(req.user)
  res.render('dashboard', {
    layout: "homeLayout",
    name: req.user.name
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get("/register", function(req, res) {
  res.render("registerPage");

});

router.post("/register", function(req, res) {
  console.log(req.body);
  var password = req.body.password;
  db.User.findAll({
    where: {
      email: req.body.email
    }
  }).then(function(results) {
    if (results.length) {
      console.log("ID exists");
      res.redirect('/registerfailed');
    } else {
      // The username wasn't found in the database
      console.log("ID doesnt exist");
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) console.log(err);
        password = hash;
        db.User.create({
          name: req.body.name,
          email: req.body.email,
          password: password,
          roleId : "2"
        });
      });

      res.redirect('/login');
    }
  }).catch(function(err) {
    res.status(400).json({
      error: err
    })
    return;
  });
});

router.get('/registerfailed', function(req, res) {
  res.render('registerPage', {
    errorMessage: 'User already exists'
  });
});

function checkloginstate(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
};
// var userRoles = {
//     guest: 1,    // ...001
//     user: 2,     // ...010
//     admin: 3     // ...100
// };
//
// accessLevels = {
//     guest: userRoles.guest | userRoles.user | userRoles.admin,    // ...111
//     user: userRoles.user | userRoles.admin,                       // ...110
//     admin: userRoles.admin                                        // ...100
// };
//
// function allowOnly(accessLevel, callback) {
//     function checkUserRole(req, res) {
//         if(!(accessLevel & req.user.roleId)) {
//             // res.sendStatus(403);
//             res.send("User not authenticated");
//             return;
//         }
//
//         callback(req, res);
//     }
//
//     return checkUserRole;
// };
