const express   = require('express'),
      router    = express.Router(),
      bcrypt    = require('bcryptjs'),
      passport  = require('passport');
//bring in user Models
let  User       = require('../models/user');

// User get route
router.get('/register', function(req, res){
    res.render('register');
});

//login route
router.get('/login', function(req, res){
    res.render('login');
});
//login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/allBlogs',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// create user post route
router.post('/register', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name','Name Field Required').notEmpty();
    req.checkBody('email','E-Mail Field Required').notEmpty();
    req.checkBody('email','Invalid e-mail').isEmail();
    req.checkBody('username','Username Field Required').notEmpty();
    req.checkBody('password','Password Required').notEmpty();
    req.checkBody('password2','Password did not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors:errors
        });
    } else {
    let newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password
        });

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
                if(err){
                    console.log(err);
                    return;
                } else {
                    req.flash('success','you are now registerd');
                    res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

//logout route
router.get('/logout', function(req, res){
  req.logOut();
  req.flash('success','You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
