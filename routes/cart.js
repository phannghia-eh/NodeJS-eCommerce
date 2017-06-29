var express = require('express');
var router = express.Router();
var User = require('../models/user');

var cartController = require('../controllers/cartController');

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

router.get('/',cartController.index);

router.get('/checkout', ensureAuthenticated,cartController.checkout);

//router.post('/checkout',cartController.doCheckOut);

router.post('/add/:id', cartController.add_item);

router.post('/delete/:id',cartController.delete_item_all);

router.post('/update/:id/:qty', cartController.update_quantity);

module.exports = router;    