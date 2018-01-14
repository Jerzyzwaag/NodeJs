var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});

var Post = mongoose.model('post', postSchema);
module.exports = Post;