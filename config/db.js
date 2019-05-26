var mysql = require('mysql');

const mongodb = require('../app/mongo-models');
const mongoose = require('mongoose');
const config = require('./config');

var con = mysql.createConnection({
  host: "localhost",
  user: "Turbo",
  password: "temp12345",
  database: "examsiteadminfrontend_development"
});
console.log("Connection created!!");

con.connect(function(err) {
    if (err) throw err;
});

mongoose.connect(config.mongodb);
const mongo = mongoose.connection;
mongo.on('error', () => {
  throw new Error('unable to connect to database at ' + config.mongodb);
});

module.exports = con;
