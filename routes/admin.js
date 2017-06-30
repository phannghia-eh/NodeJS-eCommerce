var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController.js');

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
router.get('/list-product', adminController.list_product);

router.get('/add-product', function(req, res, next) {
    res.render('admin/add-product', { title: 'Admin Page', layout:'admin' });
});

router.post('/add-product', adminController.add_new_product);

router.get('/delete-product/:id', adminController.delete_product);

router.get('/list-user', product=adminController.list_user);

router.get('/delete-user/:id', adminController.delete_user);

router.get('/add-user/', function(req, res, next) {
    res.render('admin/add-user', { title: 'Admin Page',layout:"admin" });
});

router.post('/add-user', adminController.add_new_user);

router.get('/edit-userrole/:id',adminController.edit_userrole);

router.get('/edit-product/:id',adminController.edit_product);

router.post('/edit-product/edit-product/:id',adminController.edit_productPost);
module.exports = router;