module.exports = {
    loginCheck: function (req, res, next) {
        if (req.session && req.session.user) {
            return next();
        } else {
            var err = new Error('You must be logged in to view this page.');
            err.status = 401;
            return next(err)
        }
    },
    tokenCheck: function (req, res, next) {
        var jwt = require('jsonwebtoken');
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, req.app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                   return next(null,token);
                }
            });

        } else {
            // if there is no token
            // return an error
            var err = new Error('No token provided.');
            err.status = 403;
            return next(err);

        }
    }
}

