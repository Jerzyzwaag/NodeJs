var express = require('express');
var router = express.Router();
middlewares = require("../Middleware/userAuth");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/create', function (req, res, next) {
    if (req.body.email &&
        req.body.username &&
        req.body.password) {
        //get schema
        User = mongoose.model('user');

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
        //use schema to create new user
        User.create(userData, function (err, user) {
            if (err) {
                return next(err)
            } else {
                req.session.user = user;
                return res.redirect('/');
            }
        });
    }
    else {
        var err = new Error('All fields have to be filled out');
        err.status = 400;
        return next(err);
    }
});

router.post('/login', function (req, res, next) {
    if (req.body.email &&
        req.body.password) {
        //get schema
        User = mongoose.model('user');
        //use schema static method
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.user = user;
                return res.redirect('/');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});
    
router.get('/create', function (req, res, next) {
    res.render('auth/register');
});

router.get('/login', function (req, res, next) {
    res.render('auth/login');
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.get('/profile', middlewares.loginCheck, function (req, res, next) {
    res.render('user/profile', { title: 'Profile', user: req.session.user, userid: req.session.user._id })
});

module.exports = router;
