var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var passport = require('passport');
var index = require('./routes/index');
var products = require('./routes/products');
var users = require('./routes/users');
var contact = require('./routes/contact');
<<<<<<< HEAD
var LocalStrategy = require('passport-local').Strategy;
var config = require('./config/passport');
var flash = require('connect-flash');
=======
var admin = require('./routes/admin');
var productadmin = require('./routes/product-admin');

>>>>>>> 9b7326939fed1a62ce5fd2183cc6c38c2ba0eead
var app = express();
var User = require('./models/user');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/shopping')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// view engine setup
var handlebars = require('express-handlebars').create({
<<<<<<< HEAD
  layoutsDir: path.join(__dirname, "views/layouts"),
  extname: 'hbs'
=======
    layoutsDir: path.join(__dirname, "views/layouts"),
    //defaultLayout: 'mainlayout',
    extname: 'hbs'
>>>>>>> 9b7326939fed1a62ce5fd2183cc6c38c2ba0eead
});

app.engine('hbs', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
var session = require('express-session')
app.use(session({secret: 'keyboard cat', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
    console.log(err);
});
app.use(flash());

app.use('/', index);
app.use('/products', products);
app.use('/users', users);
app.use('/contact', contact);
app.use('/admin', admin);
app.use('/productadmin', productadmin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
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
          if (!user.validPassword(password)) {
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
            } else {
                var newUser = new User();
                // set the user's local credentials
                newUser.username = username
                newUser.password = newUser.generateHash(password);
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.userrole = 'role_user';
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
          });
      }) 
}));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // catch 404 error:
    if (err.status == 404) {
        res.render('404');
    } else {
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }

});

module.exports = app;