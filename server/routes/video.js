var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

var BUCKET_NAME = 'yourvideostreamer';

var bucketParams = {
    Bucket: BUCKET_NAME,
};

/* GET home page. */
router.get('/', function(req, res, next) {
    async.parallel([
        function(callback) {
            s3.listObjects(bucketParams, function(err, data) {
                if (err)
                    callback(err);
                else
                    callback(null, data);
            });
        },
    ],
    function(err, results) {
        if (err) {
            res.send(500, "Server error");
        }
        var contents = results[0]['Contents'];
        res.send(JSON.stringify(contents));
    });
});
router.get('/:id', function(req, res, next) {
    res.send("Get sent with these params: " + JSON.stringify(req.params));
});


module.exports = router;

