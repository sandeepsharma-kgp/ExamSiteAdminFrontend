
const express = require('express');
const config = require('./config/config');
const db = require('./app/models');

const app = express();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "Turbo",
  password: "temp12345",
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
