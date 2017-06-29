var Product = require('../models/product');
var Bill = require('../models/bill');
var _ = require('underscore');

exports.index = function (req, res) {
    if(typeof(req.session.cart) !== 'undefined' && req.session.cart !== null){
        res.render('cart/cart-details',{title:'Cart',layout: 'mainlayout', items:req.session.cart});
    } else{
        res.render('cart/cart-details',{title:'Cart',layout: 'mainlayout'});
    }

};

exports.add_item = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        try{
            console.log("--------------------product info:"+product);
            if (err) {console.log(err)}

            // Initalise cart
            if (!req.session.cart) {
                req.session.cart = {
                    products: {},
                    count: 0,
                    total: 0
                };
            }
            // Check if product already in cart
            if (!req.session.cart.products[req.params.id]) {

                // Add product if not
                req.session.cart.products[req.params.id] = {
                    id:product.id,
                    title:product.title,
                    price:product.price,
                    imagePath:product.imagePath,
                    quantity: 1
                };
            }else{
                req.session.cart.products[req.params.id].quantity = req.session.cart.products[req.params.id].quantity + 1;
            }

            //Total cart
            req.session.cart.count = 0;
            req.session.cart.total = 0;
            _.each(req.session.cart.products, function (product) {
                console.log("--------------------item product info:"+product);
                req.session.cart.count = req.session.cart.count + product.quantity;
                req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
            });
            console.log("--------------------cart info:");
            console.log(req.session.cart);
            res.send({message:"success"})
        }catch(err){
            console.log(err);
        }
    });
};

exports.delete_item = function (req, res) {
    // Check item count
    if (req.session.cart.products[req.params.id].quantity > 1) {

        // Reduce count if already added
        req.session.cart.products[req.params.id].quantity = req.session.cart.products[req.params.id].quantity - 1;

    } else {

        // Remove product
        delete req.session.cart.products[req.params.id];

    }

    // Total cart
    req.session.cart.count = 0;
    req.session.cart.total = 0;
    _.each(req.session.cart.products, function (product) {
        req.session.cart.count = req.session.cart.count + product.quantity;
        req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
    });

    // Remove cart if empty
    if (req.session.cart.count === 0) {
        delete req.session.cart;
        res.render('cart/cart-details', {title:'Cart',layout: 'mainlayout', cart: undefined});
    }

    // Respond with rendered cart
    res.render('cart/cart-details', {title:'Cart',layout: 'mainlayout', cart: req.session.cart});
};

exports.delete_item_all = function (req, res) {
    var data=0;
    //remove product
    delete req.session.cart.products[req.params.id];

    // Total the cart
    req.session.cart.count = 0;
    req.session.cart.total = 0;
    _.each(req.session.cart.products, function (product) {
        req.session.cart.count = req.session.cart.count + product.quantity;
        req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
    });
    data = req.session.cart.total;
    // Remove cart if empty
    if (req.session.cart.count === 0) {
        delete req.session.cart;
    }
    // Respond with rendered cart
    res.send({data:data});
};

exports.update_quantity = function (req, res) {
// Check item count
    var data = 0;

    if (req.session.cart.products[req.params.id].quantity > 0) {
        // Reduce count if already added
        req.session.cart.products[req.params.id].quantity = req.params.qty;

    } else {
        // Remove product
        delete req.session.cart.products[req.params.id];
    }
    // Total cart
    req.session.cart.count = 0;
    req.session.cart.total = 0;
    _.each(req.session.cart.products, function (product) {
        req.session.cart.count = req.session.cart.count + product.quantity;
        req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
    });

    data = req.session.cart.total;

    console.log(data);
    // Remove cart if empty
    if (req.session.cart.count === 0) {
        delete req.session.cart;
        res.send({data:data});
    }

    // Respond with rendered cart
    res.send({data:data});
};

exports.check_out = function (req, res) {
    if(typeof(req.session.cart) !== 'undefined' && req.session.cart !== null){
        res.render('cart/check-out',{title:'Check out',layout: 'mainlayout', items:req.session.cart, user:req.user});
    } else {
        res.render('cart/check-out',{title:'Check out',layout: 'mainlayout'})
    }
};

exports.save = function (req, res) {
    var newBill = new Bill({
        user_id:req.user.id,
        user_name:req.user.username,
        email: req.user.email,
        items: req.session.cart.products,
        date: req.body.date,
        address: req.body.address,
        total: req.session.cart.total,
        status: '0'
    });
    newBill.save();
};