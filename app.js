const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//connect to DB
mongoose.connect('mongodb://localhost/Personal');
let db = mongoose.connection;

//check for DB connection
db.once('open',function(){
  console.log('Connected to mongoDB');
});

//check for db error
db.on('error',function(err){
  console.log(err);
});

//init app
const app = express();

//bring in Models
let Blog = require('./models/blog');

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));
//Load View Engine
app.set('Views',path.join(__dirname,'Views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Home Route
app.get('/',function(req, res){
  res.render('home');
});

app.get('/*',function(req, res){
  res.render('home');
});

// //WIP Route
app.get('/allBlogs', function(req, res){
  res.render('allBlogs');
});
// app.get('/allBlogs',function(req, res){
//   Blog.find({},function(err, blogs){
//     if(err){
//       console.log(err);
//     }else {
//       res.render('Blog',{
//         title:'Blogs',
//         blogs: blogs
//       });
//     }
//   });
// });

//get blog by id
app.get('/blogs/:id', function(req, res){
  Blog.findById(req.params.id, function(err, blogs){
    res.render('viewBlog',{
      blogs:blogs
    });
  });
});

//Add Route
app.get('/blogs/add', function(req, res){
  res.render('blog_add',{
    title:'Add blogs'
  });
});
//POST Route
app.post('/blogs/add', function(req, res){
  let blog = new Blog();
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.body = req.body.body;
  blog.save(function(err){
    if(err){
      console.log(err);
      return;
    }else {;
      res.redirect('/blogs');
    }
  })
});





app.listen(3000,function(){
console.log('Local server has started on port 3000!');
});
