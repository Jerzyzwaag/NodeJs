var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var username
    var userid
    if (req.session.user) {
        username = req.session.user.username;
        userid = req.session.user._id;
    }
    post = mongoose.model('post');
    var allposts
    post.find({}, function (err, posts) {
        allposts = posts;
    });
  res.render('index', { title: 'WebDev',username ,userid,allposts});
});

module.exports = router;
