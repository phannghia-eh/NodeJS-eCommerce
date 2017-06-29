var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bill = new Schema({
    user_id: String,
    user_name: String,
    email: String,
    items:[],
    date: String,
    total: Number,
    address: String,
    status: String
});

module.exports = mongoose.model('bill', Bill);