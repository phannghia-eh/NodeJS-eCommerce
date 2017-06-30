var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');

// function ensureAuthenticated(req, res, next) {
//     User.findOne({'username': req.user.username}, function (err, user){
//         console.log(user);
//         if(req.isAuthenticated() && user.userrole == 'role_admin'){
//             next();
//         } else{
//             res.redirect("/users/login");
//         }
//     })
// }

router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Admin Page' });
});
router.get('/list-product', function(req, res, next) {
   var product=adminController.list_product(req,res);
});
router.get('/add-product', function(req, res, next) {
    res.render('admin/add-product', { title: 'Admin Page', layout:'admin' });
});

router.post('/add-product', function(req, res, next) {
    var product= adminController.add_new_product(req,res);
});

router.get('/delete-product/:id', function(req, res, next) {
   var product=adminController.delete_product(req,res);
});
router.get('/list-user', function(req, res, next) {
   var product=adminController.list_user(req,res);
});
router.get('/delete-user/:id', function(req, res, next) {
   var user=adminController.delete_user(req,res);
});

module.exports = router;