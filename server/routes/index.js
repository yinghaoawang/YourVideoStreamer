var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Get sent to API server.');
});
router.post('/', function(req, res, next) {
    res.send('Post sent to API server.');
});

module.exports = router;
