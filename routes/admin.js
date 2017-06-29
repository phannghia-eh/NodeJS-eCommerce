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
    res.render('product/product-add', { title: 'Admin Page', layout:'admin' });
});

module.exports = router;