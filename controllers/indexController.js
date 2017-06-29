var Product = require('../models/product');

exports.searchBy = function (req, res) {
    var searchBy = req.query.search_by;
    var filter = req.query.filter;
    var products = [];
    if(searchBy !== null){
        Product.find({}, function (err, result) {
            result.forEach(function (obj) {
                if(filter === null || typeof(filter) === 'undefined'){
                    var str1 = obj.title.toLowerCase();
                    var str2 = searchBy.toLowerCase();
                    if(str1.indexOf(str2) >= 0){
                        products.push(obj)
                    }
                }else if(filter === "price"){
                }
            });
            res.render('product/product-list',{title:'List Products',layout: 'mainlayout', products:products});
        });
    }
};