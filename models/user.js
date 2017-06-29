var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    userrole: String,
    dob: String,
    createtime: Date,
    address: String,
    permalink: String,
    verified: Boolean,
    verification_token: String,
    resetpassword_token: String
});

// methods ======================
// generating a hash
var password;
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

User.methods.setPassword = function (password, cb) {
    if (!password) {
        return cb(new BadRequestError(options.missingPasswordError));
    }

    var self = this;

    crypto.randomBytes(options.saltlen, function(err, buf) {
        if (err) {
            return cb(err);
        }

        var salt = buf.toString('hex');

        crypto.pbkdf2(password, salt, options.iterations, options.keylen, function(err, hashRaw) {
            if (err) {
                return cb(err);
            }

            self.set(options.hashField, new Buffer(hashRaw, 'binary').toString('hex'));
            self.set(options.saltField, salt);

            cb(null, self);
        });
    });
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
    