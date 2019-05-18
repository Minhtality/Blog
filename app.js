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
//Blogs Route
app.get('/allBlogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render('allBlogs', {
                title: 'My Blogs',
                blogs: blogs
            });
        }
    });
});

//Add a blog route
app.get('/allBlogs/add', function(req, res) {
    res.render('allBlogs_add', {
        title: 'Add a blog'
    });
});

//Edit a blog Route
app.get('/allBlogs/edit/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blogs) {
        res.render('allBlogs_edit', {
            title: 'Edit entry',
            blogs: blogs
        });
    });
});

//Update a blog Route
app.post('/allBlogs/edit/:id', function(req, res) {
    let blog = {};
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.body = req.body.body;

    let query = {
        _id: req.params.id
    }

    Blog.update(query, blog, function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('info','Blog saved');
            res.redirect('/allBlogs');
        }
    });
});

//POST a blog Route
app.post('/allBlogs/add', function(req, res) {
    let blog = new Blog();
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.body = req.body.body;
    blog.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success','Blog Added');
            res.redirect('/allBlogs');
        }
    });
});

//delete a blog Route
app.delete('/allBlogs/:id', function(req, res) {
    let query = {
        _id: req.params.id
    }

    Blog.remove(query, function(err) {
        if (err) {
            console.log(err);
        }
        res.send('success');
    });
});

//view a blog by id Route
app.get('/allBlogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blogs) {
        res.render('viewBlog', {
            blogs: blogs
        });
    });
});





app.listen(80, function() {
    console.log('Local server has started on port 80!');
});