
const express = require('express');
const config = require('./config/config');
const db = require('./app/models');

const app = express();

var passport = require('passport'),
session = require("express-session");
app.use(session({ secret: 'nitrkl' ,saveUninitialized: false, resave: false})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport); // pass passport for configuration


var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "examsiteadminfrontend_development"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  // var sql = "CREATE TABLE subjects (subjectID VARCHAR(255), subjectName VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });

});

module.exports = require('./config/express')(app, config);

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
