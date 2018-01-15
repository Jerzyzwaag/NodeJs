var express = require('express');
var router = express.Router();
var middlewares = require("../Middleware/userAuth");

router.get('/', function (req, res, next) {

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
                var user = mongoose.model('user');
                user.findByIdAndUpdate(userid,
                    {
                        //push adds it to the array
                        $push: {
                            posts: post._id
                        }
                    }, function (err, response) {
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

    if (req.body.title ||
        req.body.content) {
        var post = mongoose.model('post');
        //retrieve the userid from the token
        var userid = req.decoded.userid;
        post.HaveAuthorization(req.params.id, userid, function (err, post) {
            if (err) return res.json(err);
            var postupdatedata = {}
            if (req.body.title) { postupdatedata['title'] = req.body.title }
            if (req.body.content) { postupdatedata['content'] = req.body.content }
            post.set(postupdatedata);
            post.save(function (err, updatedpost) {
                if (err) return res.json(err)
                res.json(updatedpost);
            });
        });
    } else {
        var err = new Error('Need at least a field to be filled out');
        err.status = 400;
        return res.json(err);
    }
});

router.delete('/:id', middlewares.tokenCheck, function (req, res, next) {
    var post = mongoose.model('post');
    var user = mongoose.model('user');
    //retrieve the userid from the token
    var userid = req.decoded.userid;

    post.HaveAuthorization(req.params.id, userid, function (err, post) {
        if (err) {
            return res.json(err);
        } else {
            //removes post from db
            post.remove();
            user.findById(post.user, function (err, user) {
                if (err) return res.json(err);
                //remove the post from the user posts
                user.posts.pull(post._id);
                user.save(function (err) {
                    if (err) {
                        res.json({ err, warning: 'Not all references removed' });
                    }
                    res.json(post);
                });
            });
        }
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