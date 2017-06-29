var LocalStrategy = require('passport-local').Strategy;

var localsignin = new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback: true,
      },
      function(req, username, password, done) {
        console.log('user',username, password);
        User.findOne({ 'username' : username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          }
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Wrong password.'));
          }
          return done(null, user);
        });
      }
);