var User = require('../models/user');
var Bill = require('../models/bill');
var mongoose = require('mongoose');
var passport = require('passport');
var mailer = require('nodemailer');
var randomstring = require('randomstring');

var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ngkien1530@gmail.com",
        pass: "letmein159"
    }
});

var userController = {};

userController.home = function(req, res) {
  res.render('user/userprofile', { user : req.user, layout:'mainlayout', message: req.flash('error'), });
};

userController.signup = function(req, res) {
  res.render('user/signup', { user : req.user, layout: 'mainlayout', message: req.flash('error')});
};

userController.doSignup = passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/users/signup',
      failureFlash: true
});

userController.login = function(req, res) {
  res.render('user/login' ,{ user : req.user, layout: 'mainlayout', message: req.flash('error')});
};

userController.doLogin = passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
});

userController.verifyStatus = function(req, res) {
  res.render('user/verifystatus', { user:req.user });
};

userController.verify = function (req, res) {
        var permalink = req.params.permalink;
        var verification_token = req.params.verification_token;

        User.findOne({'permalink': permalink}, function (err, user) {
            if (user.verification_token == verification_token) {
                console.log('that token is correct! Verify the user');

                User.findOneAndUpdate({'permalink': permalink}, {'verified': true}, function (err, resp) {
                    console.log('The user has been verified!');
                });

                res.redirect('/');
            } else {
                console.log('The token is wrong! Reject the user. token should be: ' + user.verification_token);
            }
        });
}

userController.verifyResetPassword = function (req, res) {
        var permalink = req.params.permalink;
        var resetpassword_token = req.params.resetpassword_token;
        console.log(resetpassword_token);
        User.findOne({'permalink': permalink}, function (err, user) {
            if (user.resetpassword_token == resetpassword_token) {
                console.log('Corrent token!');  
                res.render ('user/forgetpassword_confirm', {user : req.user, layout: 'mainlayout'});
            } else {

                console.log('The token is wrong! Reject the user. token should be: ' + user.resetpassword_token);
            }
        });
}

userController.userProfile = function(req, res)
{
    res.render ('user/userprofile', {user: req.user, layout: 'mainlayout'});
}

userController.forgetPassword = function(req, res)
{
    res.render ('user/forgetpassword', {layout: 'mainlayout'});
}

userController.doForgetPassword = function(req, res){
    var user= new User;
    user = req.user;
    console.log(req.user);
    User.findOne({'username':req.body.username}, function (err, user) {
        if (err) {
            res.render ('user/forgetpassword', {user : req.user, message: "The user doesn't exist!", layout: 'mainlayout'});
            return;
        }
        else
        {
            var resetpassword_token = randomstring.generate({
                    length: 64
            });
            var text = 'http://localhost:3000/users/' + 'resetpassword' + '/' + user.permalink + '/' + resetpassword_token;
            var mail = {
                from: "Kiên Nguyễn <from@gmail.com>",
                to: user.email,
                subject: "Kiên Nguyễn gửi bạn link reset password nè!", 
                html: text
            }
            User.findOneAndUpdate({'username':user.username}, {'resetpassword_token': resetpassword_token}, function (err, resp) {
                smtpTransport.sendMail(mail, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }
                    smtpTransport.close();
                });
            });
        }
        res.redirect('/');
    });
}

userController.changePassword = function(req, res)
{
    res.render ('user/changepassword', {user : req.user, layout: 'mainlayout'});
}

userController.doChangePassword = function(req, res){
    var user= new User;
    user = req.user;
    console.log(req.body.oldpassword);
    console.log(user);
    User.findOne({'username':user.username}, function (err, user) {
        if (!user.validPassword(req.body.oldpassword)) {
            res.render ('user/changepassword', {user : req.user, message: "Wrong password!", layout: 'mainlayout'});
            return;
        }
        else
        {
            var password2 = user.generateHash(req.body.newpassword);
            User.findOneAndUpdate({'username':user.username}, {'password': password2}, function (err, resp) {
                console.log('The password has been changed!');
            });
        }
        res.redirect('/');
    });
}

userController.forgetPasswordConfirm = function(req, res)
{
    res.render ('user/forgetPasswordConfirm', {user : req.user, layout: 'mainlayout'});
}

userController.doForgetPasswordConfirm = function(req, res){
    if(req.user == null)
    {
        res.render('user/forgetpassword_confirm', { user : req.user, layout: 'mainlayout', message: 'Please login first!'});
        return;
    }
    var user= new User;
    user = req.user;
    User.findOne({'username':user.username}, function (err, user) {
        var password2 = user.generateHash(req.body.newpassword);
        User.findOneAndUpdate({'username':user.username}, {'password': password2}, function (err, resp) {
            console.log('The password has been changed!');
        });
        
        res.redirect('/');
    });
}

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

userController.history = function (req, res) {
    var bills = [];
    Bill.find({'user_id': req.user.id}, function (err, result) {
        result.forEach(function (obj) {
            //Lấy key của từng mảng sản phẩm trong hóa đơn (productId)
            for (var key in obj.items[0]) {
                console.log("-------------------");
                console.log("Key: " + key);
                console.log("Value: " + obj[key]);
                obj.items.forEach(function (obj1) {
                    obj1 = obj1[key].title;
                })
                console.log("**********")
                console.log(obj);
            }
            bills.push(obj);
        });
        res.render('user/history_bills',{tittle: 'Add new', layout: 'mainlayout', bills: bills});
    });
};
module.exports = userController;