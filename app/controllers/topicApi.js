
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
var TopicID = require('../mongo-models/topicDropdown')
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
router.post('/api/topicdropdown/add' , function(req, res)
{
  body = req.body;
  // console.log(body.topicId);
  var top = new TopicID();
  TopicID.find({SID : req.body.SID}, function(err, data) {
    // console.log(data);
    if(err)
    console.log(err);
    else if(data.length) {
      console.log("if data");
      var topicId = data[0].topicId;
      var boolean = false;
      console.log(topicId);
      for(var i = 0; i<topicId.length; i++)  {
          if(topicId[i]== body.topicId) {
            boolean = true;
          }
      }     //for loop ends here

      console.log(boolean);
      if(boolean == false){
          TopicID.update({SID: req.body.SID}, { $push: { "topicId": req.body.topicId }}, function(err, result) {
              if (err)
                  return err;
              res.send({successMessage: "Topic added successfully to SID " + req.body.SID});
          });
      }
      else if(boolean == true) {
        console.log("topic already exists");
        res.send({errorMessage : "Topic already exists with SID " + req.body.SID});
      }
    }
    else
    {
      top.topicId = req.body.topicId;
      top.SID = req.body.SID;
      top.save();
      console.log("done");
      res.send({successMessage: "Topic updated successfully to SID " + req.body.SID});
    }
  });

});



router.get('/api/v1/topic/update/:id', function (req, res) {

  console.log(req.params.id);
  db.topic.findAll({ where: {topicId : req.params.id}}).then(function(data) {
    // console.log(data);
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.post('/api/v1/topic/name/', function (req, res) {
  id = req.body;
  // console.log(req.body);
  db.topic.findAll({ where: {topicId : id.data}}).then(function(data) {
    // console.log(data);
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});

router.post('/api/topic/update' , function(req, res)
{
  data = req.body;
  // console.log(data);
  var topic = [data.topicId, data.topicName, data.topicId];
  console.log(data.topicId);
  console.log(data.topicName);
  var sqlQuery = "UPDATE Topics SET topicId = ?, topicName = ? WHERE topicId = ?;";
  con.query(sqlQuery, topic, function(error, results){
    // There was an issue with the query
    if(error){
      console.log(error);
      return;
    }

    if(results.length){
      // The username already exists
      console.log("Updated");
    }
  });
  res.send("done");
});

router.get('/api/v1/topic/all', function (req, res) {
  db.topic.findAll().then(function(data) {
    res.json(data);
  }).catch(function(err) {
      res.status(400).json({ error: err })
  });
});

router.get('/api/v1/topic/mongo/:id', function (req, res) {

  console.log(req.params.id);
  TopicID.find({SID : req.params.id}, function(err, data) {
    res.json(data);
  }).catch(function(err) {
    res.status(400).json({ error: err })
    return;
  });
});


router.get('/api/v1/topic/delete/:id', function (req, res) {
  var id = req.params.id;
  db.topic.destroy({ where: {
      topicId: id //this will be your id that you want to delete
   }}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
         console.log('Deleted successfully');
       }
       console.log(rowDeleted);
    }, function(err){
        console.log(err);
        return;
    });

});

router.get('/api/v1/topicmongo/delete/:id', function (req, res) {
  var id = req.params.id;
  TopicID.deleteOne({"topicId": id}, (err, results) => {
        if(err)
          console.log(err);
        else {
          console.log("Success");
        }
    });

});
