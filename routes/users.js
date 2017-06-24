var express = require('express');
var router = express.Router();
var controller = require("../controllers/userController.js");


router.get('/', controller.home);

router.post('/signup', controller.doSignup);

router.get('/login', controller.login);

router.post('/login', controller.doLogin);

router.get('/logout', controller.logout);

module.exports = router;

