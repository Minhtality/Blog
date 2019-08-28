const express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  ejs = require('ejs'),
  expressValidator = require('express-validator'),
  flash = require('connect-flash'),
  session = require('express-session'),
  config = require('./config/database'),
  passport = require('passport');

//connect to DB
mongoose.connect('mongodb://localhost/Personal', {
  useCreateIndex: true,
  useNewUrlParser: true
});

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
let User = require('./models/user');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/public/js'));

//express session Middleware
app.use(
  session({
    secret: 'fat rat',
    resave: true,
    saveUninitialized: true
  })
);

//express messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator Middleware
app.use(expressValidator());
//bring in passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Home route
let home = require('./routes/home');
app.use('/', home);

//route blogs
let projects = require('./routes/projects');
app.use('/projects', projects);

//route users
let users = require('./routes/users');
app.use('/users', users);

//Host Port
app.listen(80, function() {
  console.log('Local server has started on port 80!');
});
