//use all packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors')
var jwt = require('jsonwebtoken');


//define route location
var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/post');
//define api route location
var apiusers = require('./API/User');
var apiposts = require('./API/Post');
//Models
var User = require('./Models/User');
var Post = require('./Models/Post');

//Database(Mongoose)
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/webdev', { useMongoClient: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
mongoose.Promise = global.Promise;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'work hard', resave: true, saveUninitialized: false }));

//apply routes
app.use('/', index);
app.use('/users', users);
app.use('/post', posts);
//apply api routes
app.use('/api/users', apiusers);
app.use('/api/post', apiposts);

app.set('superSecret', 'Hail Hydra');
// catch 404 and forward to error handler
app.use(function (req, res, next) {

    var err = new Error('Not Found : ' + req.path);
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
