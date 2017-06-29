var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    User.findOne({'username': req.user.username}, function (err, user){
        console.log(user);
        if(req.isAuthenticated() && user.userrole == 'role_admin'){
            next();
        } else{
            res.redirect("/users/login");
        }
    })
}

router.get('/*', ensureAuthenticated, function(req, res, next) {
    res.render('admin', { title: 'Admin Page' });
});

module.exports = router;