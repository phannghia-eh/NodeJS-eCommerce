var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mailer = require('nodemailer');
var randomstring = require('randomstring');
var User = require('../models/user');

var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ngkien1530@gmail.com",
        pass: "letmein159"
    }
});

//Passport configuration
passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
}); 

passport.use('local-signin',new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback: true,
      },
      function(req, username, password, done) {
        console.log('user',username, password);
        User.findOne({ 'username' : username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, {message: 'The username is incorrect!'});
          }
          else if (!user.validPassword(password)) {
            return done(null, false, {message: 'The password is incorrect!'});
          }
          return done(null, user);
        });
      }
));

passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
    },
    function(req, username, password, done) {
      console.log('creating user', req.body);
      process.nextTick(function() {
        User.findOne({'username': username }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, {message: 'The username is already taken!'});
            } 
            else if(req.body.confirmpassword != req.body.password)
            {
                return done(null, false, {message: 'The confirm password does not match!'});
            }
            else if(/^([a-zA-Z0-9]+)$/.test(req.body.username) == false && req.body.username.length < 6 )
            {
                return done(null, false, {message: 'The username must be larger than 5 and must not content special characters and spaces!'});
            }
            else if(/^([ ]+)$/.test(req.body.password) == false && req.body.password.length < 6 )
            {
                return done(null, false, {message: 'The password must be larger than 5 and must not content spaces!'});
            }
            else {
                var newUser = new User();
                var permalink = req.body.username.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();

                var verification_token = randomstring.generate({
                    length: 64
                });
                var text = 'http://localhost:3000/users/' + 'verify' + '/' + permalink + '/' + verification_token;
                var mail = {
                    from: "Kiên Nguyễn <from@gmail.com>",
                    to: req.body.email,
                    subject: "Kiên Nguyễn gửi bạn link verify email nè!", 
                    html: text
                }
                // set the user's local credentials
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.userrole = 'role_user';
                newUser.dob = '';
                newUser.createtime = Date.now();
                newUser.address = '';

                newUser.resetpassword_token = 'Empty';
                newUser.permalink = permalink;
                newUser.verified = false;
                newUser.verification_token = verification_token;
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    else {
                        smtpTransport.sendMail(mail, function(error, response){
                            if(error){
                                console.log(error);
                            }else{
                                console.log("Message sent: " + response.message);
                                return done(null, newUser);
                            }
                            smtpTransport.close();
                        });
                    }
                });
            }
          });
      }) 
}));
