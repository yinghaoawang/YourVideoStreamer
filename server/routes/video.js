var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var fs = require('fs');
var filePath = ('./file.mp4');
var stream = require('stream')

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

var BUCKET_NAME = 'yourvideostreamer';

var bucketParams = {
    Bucket: BUCKET_NAME,
    Key: 'file.mp4',
};

/*
function uploadFromStream(s3) {
    var pass = new stream.PassThrough();
    var params = bucketParams;
    params['Body'] = pass;
    s3.upload(params, function(err, data){
        console.log(err, data);
    });
    return pass;
}
*/

router.post('/', function(req, res, next) {
    async.parallel([
        function(callback) {
            fs.stat(filePath, function(err, stats) {
                if (err) callback(err);
                else {
                    var file = fs.createReadStream(filePath);
                    //file.pipe(uploadFromStream(s3));
                    var params = bucketParams;
                    params['Body'] = file;
                    params['ContentType'] = 'video/mp4';
                    s3.upload(params, function(err, data) {
                        if (err) callback(err);
                        else callback(null, data);
                    });
                }
            });
        },
    ],
    function(err, results) {
        if (err) res.send(err);
        else res.send(results);
    });
});

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
            res.status(500).send(err);
        }
        //var contents = results[0]['Contents'];
        res.send(JSON.stringify(results));
    });
});
router.get('/:id', function(req, res, next) {
    res.send("Get sent with these params: " + JSON.stringify(req.params));
});


module.exports = router;

