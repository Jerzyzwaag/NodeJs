var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

var Post = mongoose.model('post', postSchema);
module.exports = Post;