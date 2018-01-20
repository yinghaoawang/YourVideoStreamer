var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var fs = require('fs');
//var filePath = ('./file.mp4');
var filename = 'file.mp4';
var filePath = ('./file.mp4');
var stream = require('stream')
var config = require("../config.json");

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

var bucketName = config.bucketName;
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

//connection.connect();

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

router.get('/:key', function(req, res, next) {
    async.parallel([
        function(callback) {
            var key = req.params['key'];
            var params = {
                Bucket: bucketName,
                Key: key,
            };
            var fileStream = s3.getObject(params).createReadStream();
            callback(null, fileStream);
        },
    ], function(err, results) {
        if (err) res.send(err);
        else res.send(results);
    });
});

router.post('/', function(req, res, next) {
    async.waterfall([
        function(callback) {
            var stats = fs.statSync(filePath);
            var name = filename;
            var size = stats.size;
            var date_recorded = new Date().toISOString().slice(0, 19).replace('T', ' ');
            var duration = 5000;
            var file = fs.createReadStream(filePath);
            var params = {
                Bucket: bucketName,
                Key: filename,
                Body: file,
            };
            console.log("uploading");
            s3.upload(params, function(err, data) {
                if (err) callback(err);
                else {
                    var url = data.Location;
                    var sqlData = {
                        'name': name,
                        'size': size,
                        'date_recorded': date_recorded,
                        'duration': duration,
                        'url': url,
                    };
                    callback(null, sqlData);
                }
            });
        },
        function(sqlData, callback) {
            console.log("uploaded");
            var sql = "INSERT INTO videos (name, date_recorded, duration, size, url) VALUES ?";
            var values = [
                [sqlData.name, sqlData.date_recorded, sqlData.duration, sqlData.size, sqlData.url]
            ];
            connection.query(sql, [values], function(err, result) {
                if (err) callback(err);
                else {
                    callback(null, result);
                }
            });
        }
    ],
    function(err, results) {
        if (err) res.send(err);
        else {
            res.send(results);
        }
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(bucketName);
    async.parallel([
        function(callback) {
            var params = {
                Bucket: bucketName,
            };
            s3.listObjects(params, function(err, data) {
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

