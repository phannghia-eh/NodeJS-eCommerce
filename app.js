var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var passportconfig = require('./config/passport');
var passport = require('passport');
var index = require('./routes/index');
var products = require('./routes/products');
var users = require('./routes/users');
var contact = require('./routes/contact');
var cart = require('./routes/cart');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var admin = require('./routes/admin');
var productadmin = require('./routes/product-admin');

var app = express();
var User = require('./models/user');
var moment = require('moment');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/shopping');
var dbMongo = mongoose.connection;
dbMongo.on('err', console.error.bind(console, 'connect fail'));
dbMongo.once('open',function () {
    console.log('mongo connected');
});
// view engine setup
var handlebars = require('express-handlebars').create({
    layoutsDir: path.join(__dirname, "views/layouts"),
    extname: 'hbs',
    helpers: {
        formatDate: function () {
            return moment().format('MMMM Do YYYY, h:mm:ss a');
        }
    }
});

app.engine('hbs', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
var session = require('express-session');
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
app.use('/cart', cart);

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