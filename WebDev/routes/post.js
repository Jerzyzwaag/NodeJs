var express = require('express');
var router = express.Router();
var middlewares = require("../Middleware/userAuth");

router.get('/', function (req, res, next) {
    //res.json('hey you here?');
    var userid
    if (req.session.user) {
        userid = req.session.user._id
    }
    post = mongoose.model('post');
    post.find({}, function (err, posts) {
        if (err) return err;
        res.render('post/allPost', { posts: posts,title:'Posts', userid: userid });
    });
});


router.get('/create', middlewares.loginCheck, function (req, res, next) {
    //res.json('hey you here?');
    res.render('post/createPost');
});

router.post('/create', middlewares.loginCheck, function (req, res, next) {
    if (req.body.title &&
        req.body.content) {
        var post = mongoose.model('post');
        var postData = { title: req.body.title, content: req.body.title, user_id: req.session.user._id }
        post.create(postData, function (err, post) {
            if (err) {
                return next(err)
            } else {
                var user = mongoose.model('user');
                user.findOneAndUpdate({
                    _id: req.session.user._id
                }, {
                        $push: {
                            posts: post._id
                        }
                    }, function (err, response) {
                        console.log(response);

                    });
                return res.redirect('/post/' + post._id);
            }
        });
    } else {
        var err = new Error('All fields have to be filled out');
        err.status = 400;
        return next(err);
    }

});

router.post('/delete/:id', function (req, res, next) {
    console.log("deleting of post")
    post = mongoose.model('post');
    post.findOneAndRemove({ _id: req.params.id }, function (err, result) {
        if (err) return err;
        console.log(result);
        res.redirect('/post');
    });
});

router.get('/:id', function (req, res, next) {
   var post = mongoose.model('post');
    post.findById(req.params.id).exec(function (err, post) {
        if (err) {
            return next(err)
        } else if (!post) {
            var err = new Error('Post not found.');
            err.status = 401;
            return next(err);
        }
        var creator;
        var userModel = mongoose.model('user');
        userModel.findById(post.user_id).exec(function (err, user) {
            console.log("made it");
            if (err) {
                creator = err;
            } else if (!user) {
                creator = "empty";
            }
            console.log(user);
            creator = user;
            res.render('post/ViewPost', { title: post.title, post, creator })
        })
        //res.render('post/ViewPost', { title: post.title, post,creator })
    });
});


module.exports = router;