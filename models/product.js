var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product=new Schema({
    imagePath: {type: [], required:true},
    title: {type: String, required:true},
    price: {type: Number, required:true},
    description: {type: String, required:true},
    sell: Number,
    tag: [],
    avaliable: Boolean,
    brand: String,
    reviews: []
});

var product = mongoose.model('Product', product);

module.exports = product;