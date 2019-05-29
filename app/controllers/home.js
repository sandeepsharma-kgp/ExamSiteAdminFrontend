
const express = require('express');
const router = express.Router();
const db = require('../models');
const config = require('../../config/config');
var passport = require('passport');
var session = require('express-session');
var flash    = require('connect-flash');
var crypto            = require('crypto');
var LocalStrategy     = require('passport-local').Strategy;
var TopicID = require('../mongo-models/topicDropdown');

router.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false})); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
require('../../config/passport')(passport);
router.use(flash());

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', function(req,res){
  res.redirect("/login");
});

router.get('/question/dropdown', function(req, res) {
  res.render("quesDropdown");
});
