const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//connect to DB
mongoose.connect('mongodb://localhost/Personal');
let db = mongoose.connection;

//check for DB connection
db.once('open', function() {
    console.log('Connected to mongoDB');
});

//check for db error
db.on('error', function(err) {
    console.log(err);
});

//init app
const app = express();

//bring in Models
let Blog = require('./models/blog');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
        extended: false
    }))

// parse application/json
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/public/js'));

//express session Middleware
app.use(session({
  secret: 'fat rat',
  resave: true,
  saveUninitialized: true
}))

//express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator Middleware
app.use(expressValidator());﻿

//Home Route
app.get('/', function(req, res) {
    res.render('home.ejs');
});

//route files
let blogs = './routes/blogs';
app.use('/allBlogs', require('./routes/blogs.js'));


//Host Port
app.listen(80, function() {
    console.log('Local server has started on port 80!');
});