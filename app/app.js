var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var path = require('path');

var auth = new (require('./basis/auth'))();
var router = require('./basis/router');
var config = require('../config.json');

var app = express();

// passport
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: false }
}));
passport.use(auth.strategy());
app.use(passport.initialize());
app.use(passport.session());
auth.serialization(passport);
auth.deserialization(passport);

// parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// static
app.use('/src', express.static(path.join(__dirname, '../client/source')));

// view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../client/views');

app.use(router);

module.exports = app;