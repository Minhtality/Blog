const express   = require('express'),
      router    = express.Router();

//Home Route
router.get('/', function(req, res) {
    res.render('home');
});

router.get('/resume', function(req, res){
  res.render('resume');
});

module.exports = router;
