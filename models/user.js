const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//user schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username:{
    type: String,
    required: true,
    unique: true

  },
  password:{
    type: String,
    required: true
  }
});
userSchema.plugin(uniqueValidator);

const User = module.exports = mongoose.model('User',userSchema);
