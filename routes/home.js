const express   = require('express'),
      router    = express.Router();

//Home Route
router.get('/', function(req, res) {
    res.render('home.ejs');
});

module.exports = router;
