var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false  },
    email: { type: String, required: true, unique: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'post'}],
});

userSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email }).select('+password')
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                err.status = 401;
                return callback(err);
            }
            if (password === user.password) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
};



var User = mongoose.model('user', userSchema);
module.exports = User;