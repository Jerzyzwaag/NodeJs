var express = require('express');
var router = express.Router();
var middlewares = require("../Middleware/userAuth");

router.get('/', function (req, res, next) {
    var userid
    if (req.decoded) {
        userid = req.decoded.userid;
    }
    post = mongoose.model('post');
    post.find({}, function (err, posts) {
        if (err) return res.json(err);
        res.json(posts)
    });
});


router.post('/create', middlewares.tokenCheck, function (req, res, next) {
    if (req.body.title &&
        req.body.content) {
        var post = mongoose.model('post');
        var userid = req.decoded.userid;
        var postData = { title: req.body.title, content: req.body.title, user: userid }
        post.create(postData, function (err, post) {
            if (err) {
                return res.json(err);
            } else {
                console.log(post);
            
                var user = mongoose.model('user');
                user.findByIdAndUpdate(userid,
                    {
                        $push: {
                            posts: post._id
                        }
                    }, function (err, response) {
                        console.log(response);

                    });
                return res.json(post);
            }
        });
    } else {
        var err = new Error('All fields have to be filled out');
        err.status = 400;
        return res.json(err);
    }

});


router.patch('/:id', middlewares.tokenCheck, function (req, res, next) {

    if (req.body.title &&
        req.body.content) {
        var post = mongoose.model('post');
        var postupdatedata = { title: req.body.title, content: req.body.content }
        console.log("postupdate");
        post.findByIdAndUpdate(req.params.id, postupdatedata, { new: true }, function (err, post) {
            if (err) return res.json(err);
            res.json(post);
        });
    } else {
        var err = new Error('All fields have to be filled out');
        err.status = 400;
        return res.json(err);
    }
});
router.delete('/:id', middlewares.tokenCheck, function (req, res, next) {
    console.log("deleting of post")
    post = mongoose.model('post');
    post.findByIdAndRemove(req.params.id, function (err, result) {
        if (err) return res.json(err);
        res.json(result);
    });
});

router.get('/:id', function (req, res, next) {
    var post = mongoose.model('post');
    post.RetrievePostAndUserById(req.params.id, function (err, post) {
        if (err || !post) return res.json(err);
        res.json(post)
    });
});


module.exports = router;