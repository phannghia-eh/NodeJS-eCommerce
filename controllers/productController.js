var Product = require('../models/product');

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

//get list for index page
exports.product_list_index = function (req, res, next) {
    var products=[];
    Product.find({}, function (err, result) {
        result.forEach(function (obj) {
            products.push(obj);
        });
        res.render('index',{title:'Index', user: req.user,layout: 'mainlayout', products:products});
    });
};

// get list of all Products
exports.product_list = function (req, res, next) {
    var category = req.query.category;
    var products = [];
    if(typeof (category) !== 'undefined'){
        Product.find({'brand':category},function (err, result) {
            result.forEach(function (obj) {
                products.push(obj);
            });
            res.render('product/product-list',{title:'List Products',layout: 'mainlayout', products:products});
        })
    }else{
        Product.find({}, function (err, result) {
            result.forEach(function (obj) {
                products.push(obj);
            });
            res.render('product/product-list',{title:'List Products',layout: 'mainlayout', products:products, user: req.user});
        });
    }
};

// Get product details
exports.product_details = function (req, res) {
    var product;console.log("----------------------");
    console.log(req.params.id);
    Product.findById(req.params.id, function (err, result) {
        console.log("----------------------");
        console.log(result);
        res.render('product/product-details',{title: 'Products details',layout:'mainlayout', product:result, user: req.user});
    })
};

//Get 'Add new' Page
exports.product_AddNew_Get = function (req, res) {
    res.render('product/product-add',{tittle: 'Add new', layout: 'mainlayout', message: '', user: req.user});
};

// Post 'Add new' Page
exports.product_AddNew_Post = function (req, res) {
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
                res.render('product/product-add', {tittle: 'Add new', user: req.user, layout: 'mainlayout', message: err});
            })
        }
    });

};

//Get 'Edit' page
exports.product_Edit_Get = function (req, res) {
    var product;
    Product.findById(req.param.id, function (err, found) {
        product = found;
        res.render('product/product-edit', {tittle: 'Edit', user: req.user, layout: 'mainlayout', product: product, message: err});
    });
}
exports.product_Edit_Post = function (req, res) {
    var newProduct = new Product({
        "imagePath":req.body.imagePath,
        "title": req.body.title,
        "price": req.body.price,
        "description": req.body.description,
        "tag": req.body.tag
    });

    Product.findByIdAndUpdate(req.param.id, newProduct, function (err) {
        return err;
    })
};

exports.product_Delete = function (req, res) {
    Product.findByIdAndRemove(req.param.id, function (err) {
        res.redirect('/admin');
    })
};

exports.product_review = function (req, res) {
    try{
        Product.findById(req.body.id, function (err, product) {

            product.reviews.push(req.body.data);
            product.save();
            res.send({message:"success"});
        });
    }catch (err){
        console.log(err);
    }
};