const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

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

//Load View Engine
app.set('Views',path.join(__dirname,'Views'));
app.set('view engine', 'pug');

//Home Route
app.get('/',function(req, res){
  Blog.find({},function(err, blogs){
    if(err){
      console.log(err);
    }else {
      res.render('index',{
        title:'Blogs',
        blogs: blogs
      });
    }
  });
});


//Add Route
app.get('/blogs/add', function(req,res){
  res.render('add_blog',{
    title:'Add blogs'
  });
});





app.listen(3000,function(){
console.log('Local server has started on port 3000!');
});
