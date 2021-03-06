﻿var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});

postSchema.statics.retrieveById = function (id, callback) {
    post.findById(id).exec(function (err, post) {
        var err = handleErr(err, post);
        
        return callback(err, post);
    });
};

postSchema.statics.RetrievePostAndUserById = function (id, callback) {
    post.findById(id)
        //uses the id stored in user to populate a user object as defined in the schema
        .populate('user')
        .exec(function (err, post) {
            var err = handleErr(err, post);
            console.log(err);
            return callback(err, post);
        });
};

postSchema.statics.HaveAuthorization = function (postid, userid, callback) {
    post.findById(postid, function (err, post) {
        var err = handleErr(err, post);
        if (err) {
            return callback(err, null);
        }
        if (post.user != userid) {
            var autherr = new Error('No Authorization');
            autherr.status = 403;
            return callback(autherr, null);
        } else {
            return callback(err, post);
        }
    })
}
function handleErr(err, post) {
    if (err) {
        return err;
    } else if (!post) {
        var err = new Error('Post not found.');
        err.status = 401;
        return err;
    }
    return null;
}


var post = mongoose.model('post', postSchema);
module.exports = post;