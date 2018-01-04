var Product = require('../models/product');

exports.searchBy = function (req, res) {
    var searchBy = req.query.searchBy;
    var price = req.query.price;
    var type = req.query.type;
    var brand = req.query.brand;
    var rate = req.query.rate;
    var products = [];
    if(searchBy !== null){
        Product.find({}, function (err, result) {
            result.forEach(function (obj) {
                console.log("------------------------------------");
                var isValid = true;
                if(price !== null && typeof(price) !== 'undefined'){
                    console.log("------------obj price: "+obj.price+"----------");
                    switch (type){
                        case '-1':
                            if(obj.price > price){
                                isValid = false;
                            }; break;
                        case '1':
                            if(obj.price < price) {
                                isValid = false;
                            }; break;
                    }
                }
                if(brand !== null && typeof(brand) !== 'undefined' && brand !== ""){
                    if(obj.brand.toLowerCase() !== brand.toLowerCase()){
                        isValid = false;
                    }
                }
                if(rate !== null && typeof(rate) !== 'undefined' && rate !== ""){
                    isValid = false;
                    for( var index = 0; index < obj.reviews.length; index++){
                        var review = obj.reviews[index];
                        if(review.rate === rate)
                            isValid=true;
                    }
                }
                if(isValid){
                    var str1 = obj.title.toLowerCase();
                    var str2 = searchBy.toLowerCase();
                    if(str1.indexOf(str2) >= 0){
                        products.push(obj)
                    }
                }
            });
            res.render('product/product-list',{title:'List Products',layout: 'mainlayout', products:products});
        });
    }
};

exports.advanced_search_page =function (req ,res) {
    res.render('search', {title:'Advanced search', layout:'mainlayout'});
}