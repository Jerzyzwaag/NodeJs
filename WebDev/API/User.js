var express = require('express');
var router = express.Router();
var middlewares = require("../Middleware/userAuth");
var jwt = require('jsonwebtoken');


router.post('/create', function (req, res, next) {
    if (req.body.email &&
        req.body.username &&
        req.body.password) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
        //get schema
        var User = mongoose.model('user');
        //use schema to create new user
        User.create(userData, function (err, user) {
            if (err) {
                return res.json(err)
            } else {
                req.session.user = user;
                return res.json({ message: 'Registration succesfull', user })
            }
        });
    }
    else {
        var err = new Error('All fields have to be filled out');
        err.status = 400;
        return res.json(err)
    }
});

router.post('/login', function (req, res, next) {
    if (req.body.email &&
        req.body.password) {
        //get schema
        var User = mongoose.model('user');
        //use schema static method
        User.authenticate(req.body.email, req.body.password, function (err, user) {
            if (err || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return res.json(err)
            }
            const payload = {
                user: user.username,
                email: user.email,
                userid: user._id
            }
            var token = jwt.sign(payload, req.app.get('superSecret'), {
                expiresIn: 1440 * 60 // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });

        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return res.json(err)
    }
});

router.get('/profile', middlewares.tokenCheck, function (req, res, next) {
    userid = req.decoded.userid;
    var User = mongoose.model('user');

    User.findById(userid).populate('posts').exec(function (err, user) {
        if (err) {
            return res.json(err)
        } else if (!user) {
            var err = new Error('Post not found.');
            err.status = 401;
            return res.json(err)
        }
        res.json(user)
    });
});

module.exports = router;
