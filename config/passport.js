// config/passport.js
var passport = require('passport');
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');
var db = require('../app/models/index');
var bcrypt = require('bcrypt');

module.exports = function(passport) {

passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true //passback entire req to call back
    },
    function(req, email, password, done) {
      if (!email || !password)
        return done(null, false, req.flash('loginMessage', 'All fields are required.'));
      //   var params = [email , password];
      // con.query("select * from Users where (email = ? AND password = ? )",params, function(err, rows){
      //     console.log(err); console.log(rows);
      // if (err)
      //   return done(req.flash('loginMessage',err));
      // if(!rows.length)
      //   return done(null, false, req.flash('loginMessage','Invalid username or password.'));
      //   return done(null, rows[0]);
      // });
      db.User.findAll({
        where: {
          email: email
        }
      }).then(function(results) {
          if (results.length) {
            const result = bcrypt.compareSync(password, results[0].password);
            if (result) {
              return done(null, results[0]);
            } else {
              console.log("error");
              return done(null, false, req.flash('loginMessage', 'Invalid Password.'));
            }
          } else {
            // The username wasn't found in the database

            return done(null, false, req.flash('loginMessage', 'Invalid username.'));

            //>>query logic should go here.
          }

        // res.redirect('/login?register=success');
      });

}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

};
