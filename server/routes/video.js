var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var fs = require('fs');
var stream = require('stream')
var config = require("../config.json");

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
connection.connect();

// directly get a file from aws s3 where key is the name of the key on bucket
router.get('/:key', function(req, res, next) {
    async.parallel([
        function(callback) {
            var key = req.params['key'];
            var params = {
                Bucket: config.bucketName,
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

// when given params, upload file to aws and store the metadata in db as well as the direct aws file link
router.post('/', function(req, res, next) {
    var filename = 'file.mp4';
    var filePath = ('./file.mp4');
    async.waterfall([
        function(callback) {
            var file = fs.createReadStream(filePath);
            var params = {
                Bucket: config.bucketName,
                Key: filename,
                Body: file,
            };
            console.log("uploading");
            s3.upload(params, function(err, data) {
                if (err) callback(err);
                else {
                    var stats = fs.statSync(filePath);
                    var sqlData = {
                        'name': filename,
                        'size': stats.size,
                        'date_recorded': new Date().toISOString().slice(0, 19).replace('T', ' '),
                        'duration': 5000,
                        'url': data.Location,
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
        if (err)
            res.send(err);
        else
            res.send(results);
    });
});

// returns all database video metadata
router.get('/', function(req, res, next) {
    async.parallel([
        /*
        function(callback) {
            var params = {
                Bucket: config.bucketName,
            };
            s3.listObjects(params, function(err, data) {
                if (err)
                    callback(err);
                else
                    callback(null, data);
            });
        },
        */
        function(callback) {
            var sql = "SELECT * FROM videos";
            connection.query(sql, function(err, result) {
                if (err) callback(err)
                else
                    callback(null, result);
            });
        }
    ],
    function(err, results) {
        if (err) {
            res.status(500).send(err);
        }
        //var contents = results[0]['Contents'];
        else {
            res.send(JSON.stringify(results[0]));
        }
    });
});
router.get('/:id', function(req, res, next) {
    res.send("Get sent with these params: " + JSON.stringify(req.params));
});


module.exports = router;

