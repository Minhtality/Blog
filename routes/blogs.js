const express = require('express');
const router = express.Router();

//bring in blogs Models
let Blog = require('../models/blog');

//Blogs Route
router.get('/', function(req, res) {
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
router.get('/add', function(req, res) {
    res.render('allBlogs_add', {
        title: 'Add a blog'
    });
});

//Edit a blog Route
router.get('/edit/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blogs) {
        res.render('allBlogs_edit', {
            title: 'Edit entry',
            blogs: blogs
        });
    });
});

//Update a blog Route
router.post('/edit/:id', function(req, res) {
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
router.post('/add', function(req, res) {
    req.checkBody('title','Title required').notEmpty();
    req.checkBody('author','Author required').notEmpty();
    req.checkBody('body','Body required').notEmpty();
    //get error if any
    let errors = req.validationErrors();
    if(errors){
      res.render('allBlogs_add',{
        title: 'Add a blog',
        errors:errors
      });
    } else {
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
    }
});


//delete a blog Route
router.delete('/:id', function(req, res) {
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
router.get('/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blogs) {
        res.render('viewBlog', {
            blogs: blogs
        });
    });
});

module.exports = router;
