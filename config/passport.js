// config/passport.js
var passport=require('passport');
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User          = require('../app/models/user');

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "Turbo",
  password: "temp12345",
  database: "examsiteadminfrontend_development"
});
console.log("Connection created!!");


module.exports = function(passport) {

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} ,
  function (req, email, password, done)
  {
      if(!email || !password )
        return done(null, false, req.flash('message','All fields are required.'));
      con.query("select * from Users where email = ?", [email], function(err, rows){
          console.log(err); console.log(rows);
      if (err)
        return done(req.flash('message',err));
      if(!rows.length)
        return done(null, false, req.flash('message','Invalid username or password.'));
        return done(null, rows[0]);
      });
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});

};
