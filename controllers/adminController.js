var Admin = require('../models/user');
var Product = require('../models/product');
var User = require('../models/user');

//Upload Image
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname+'/../public/images/product');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage:storage}).array('imageFile',4);

exports.index = function (req, res) {
    //res.render('admin/index', { title: 'Admin Page', username: req.user.username});
    res.render('admin/index', { title: 'Admin Page'});
};

exports.list_product = function (req, res) {
    var products = [];
    Product.find({}, function (err, result) {
        result.forEach(function (obj) {
            products.push(obj);
        });
        res.render('admin/list-products', {title:'List Products',products:products,layout:'admin'});
    });
};
exports.delete_product= function(req,res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {alert("Not delete");}
        else
        {var user= exports.list_product(req,res);}
    });
}

exports.list_user= function(req,res){
   var users = [];
   User.find({}, function (err, result) {
        result.forEach(function (obj) {
            users.push(obj);
        });
        res.render('admin/list-user', {title:'User',users:users,layout:'admin'});
    }); 
}
exports.delete_user= function(req,res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {alert("Not delete");}
        else
        {exports.list_user(req,res);}
    });
}
exports.add_new_product = function(req,res){
    console.log(req.files);
    upload(req, res, function () {
        if(typeof req.files !== "undefined"){
            var listImage = [];
            req.files.forEach(function (obj) {
                listImage.push("/images/product/"+obj.originalname);
            });
            console.log(listImage);
            var newProduct = new Product({
                "imagePath":listImage,
                "title": req.body.title,
                "price": req.body.price,
                "brand": req.body.brand,
                "description": req.body.description,
                "tag": req.body.tag
            });
            newProduct.save(function (err) {
                res.render('admin/add-product', {tittle: 'Add new',layout: 'admin'});
            })
        }
    });
} 
exports.add_new_user = function(req,res){
     var newUser = new User({
                "name": req.body.name,
                "username": req.body.username,
                "email": req.body.email,
                "password": req.body.password,
                "userrole": req.body.userrole,
            });
    newUser.save(function (err) {
                exports.list_user(req,res);
            })
}
exports.edit_userrole= function(req,res){
    var role="123";
    User.findById(req.params.id,function(err,a){
        console.log(a);
        if(a.userrole=="role_user")
            role="role_admin";
        else
            role="role_user";
        console.log(role);
        User.findByIdAndUpdate(a.id,{$set: {"userrole": role}}, function(err,result){
            if(err)
                alert("Can not edit role");
            else
                console.log(role);
                exports.list_user(req,res);
        });    
    });
}