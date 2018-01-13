﻿var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true }
});

userSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            if (password == user.password) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
};



var User = mongoose.model('user', userSchema);
module.exports = User;