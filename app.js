require('dotenv').config()
const express = require('express');
const config = require('./config/config');
const db = require('./app/models');
var con = require('./config/db')

const app = express();

var passport = require('passport'),
session = require("express-session");
app.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false, cookie: { maxAge : 6000000}})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport); // pass passport for configuration
app.use('/uploads', express.static('uploads'));

module.exports = require('./config/express')(app, config);

console.log(config);

db.sequelize
  .sync()
  .then(() => {
    if (!module.parent) {
      app.listen(config.port, () => {
        console.log('Express server listening on port ' + config.port);
      });
    }
  }).catch((e) => {
    throw new Error(e);
  });
