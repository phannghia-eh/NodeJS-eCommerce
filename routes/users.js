var express = require('express');
var router = express.Router();
var User = require('../models/user')
var controller = require("../controllers/userController.js");

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated())
    {
        User.findOne({'username': req.user.username}, function (err, user){
        console.log(user);
        if(user.verified == true){
            next();  
        }
        else res.redirect("/users/verifystatus");
        })
    }
    else {
        res.redirect("/users/login");
    }
}

router.get('/',ensureAuthenticated, controller.home);

router.get('/signup', controller.signup);

router.post('/signup', controller.doSignup);

router.get('/login', controller.login);

router.post('/login', controller.doLogin);

router.get('/logout', controller.logout);

router.get('/verifystatus', controller.verifyStatus);

router.get('/forgetpassword', controller.forgetPassword);

router.post('/forgetpassword', controller.doForgetPassword);

router.get('/forgetpassword_confirm', controller.forgetPasswordConfirm);

router.post('/forgetpassword_confirm', controller.doForgetPassword);

router.get('/userprofile', ensureAuthenticated, controller.userProfile);

router.get('/changepassword', controller.changePassword);

router.post('/changepassword', controller.doChangePassword);

router.get('/verify/:permalink/:verification_token', controller.verify);

router.get('/resetpassword/:permalink/:resetpassword_token', controller.verifyResetPassword);

router.get('/history',controller.history);

module.exports = router;

