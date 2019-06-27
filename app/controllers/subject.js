
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

router.get('/subject/add', function(req, res)
{
  res.render("subjectInput");

});

router.get('/subject/update/:id' , function(req, res) {
  res.render("updateSubject");
});

router.get('/subject/view' , function (req, res){
  res.render("subjectView");
});
