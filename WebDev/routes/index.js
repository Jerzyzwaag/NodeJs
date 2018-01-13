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
  res.render('index', { title: 'WebDev',username ,userid});
});

module.exports = router;
