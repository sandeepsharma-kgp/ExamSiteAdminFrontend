var mysql = require('mysql');

const mongodb = require('../app/mongo-models');
const mongoose = require('mongoose');
const config = require('./config');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_SQL
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
