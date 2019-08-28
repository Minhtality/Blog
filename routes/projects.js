const express = require('express'),
  router = express.Router();

//bring in blogs/users Models
let Blog = require('../models/blog');
let User = require('../models/user');

//Blogs Route

router.get('/', function(req, res) {
  res.render('projects');
});

router.get('/allblogs', function(req, res) {
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
router.get('/allblogs/add', ensureAuthenticated, function(req, res) {
  res.render('allBlogs_add', {
    title: 'Add a blog'
  });
});

//Edit a blog Route
router.get('/allblogs/edit/:id', ensureAuthenticated, function(req, res) {
  Blog.findById(req.params.id, function(err, blogs) {
    if (blogs.author == req.user._id || req.user.username == 'Admin') {
      res.render('allBlogs_edit', {
        title: 'Edit entry',
        blogs: blogs
      });
    } else {
      req.flash('danger', 'Unauthorized access');
      return res.redirect('/projects/allBlogs');
    }
  });
});

//Update a blog Route
router.post('/allblogs/edit/:id', function(req, res) {
  let blog = {};
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.body = req.body.body;

  let query = {
    _id: req.params.id
  };

  Blog.updateOne(query, blog, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('info', 'Blog saved');
      res.redirect('/projects/allBlogs');
    }
  });
});

//POST a blog Route
router.post('/allblogs/add', function(req, res) {
  req.checkBody('title', 'Title required').notEmpty();
  // req.checkBody('author','Author required').notEmpty();
  req.checkBody('body', 'Body required').notEmpty();
  //get error if any
  let errors = req.validationErrors();
  if (errors) {
    res.render('allBlogs_add', {
      title: 'Add a blog',
      errors: errors
    });
  } else {
    let blog = new Blog();
    blog.title = req.body.title;
    blog.author = req.user._id;
    blog.body = req.body.body;
    blog.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Blog Added');
        res.redirect('/projects/allBlogs');
      }
    });
  }
});

//delete a blog Route
router.delete('/allblogs/:id', function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = {
    _id: req.params.id
  };
  Blog.findById(req.params.id, function(err, blogs) {
    if (blogs.author == req.user._id || req.user.username == 'Admin') {
      Blog.deleteOne(query, function(err) {
        if (err) {
          console.log(err);
        }
        res.send('success');
        res.render('/');
      });
    } else {
      res.status(500).send();
    }
  });
});

//view a blog by id Route
router.get('/allblogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, blogs) {
    User.findById(blogs.author, function(err, user) {
      res.render('viewBlog', {
        blogs: blogs,
        author: user.name
      });
    });
  });
});

//access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please signup/login');
    res.redirect('/users/login');
  }
}

module.exports = router;
