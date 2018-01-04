var User = require('../models/user');

exports.isAdmin = function (req, res, next) {
    if(req.user){
        User.findOne({'username': req.user.username}, function (err, user){
            console.log(user);
            if(req.isAuthenticated() && user.userrole == 'role_admin'){
                next();
            } else{
                res.redirect("/users/login");
            }
        })
    }else{
        res.redirect('/');
    }
}