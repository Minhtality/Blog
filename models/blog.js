let mongoose = require('mongoose');

//blog schema
let blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

let Blog = module.exports = mongoose.model('Blog',blogSchema);
