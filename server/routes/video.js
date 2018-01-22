var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var fs = require('fs');
var stream = require('stream')
var config = require('../config.json');
var multer = require('multer');
var upload = multer({ dest: 'tmp/' });
var probe = require('node-ffprobe');

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

/*
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
*/

// when given params, upload file to aws and store the metadata in db as well as the direct aws file link
router.post('/', upload.single('file'), function(req, res, next) {
    var rawFile = req.file;
    var filePath = __dirname + "/../" + rawFile.path;
    async.waterfall([
        function(callback) {
            probe(filePath, function(err, probeData) {
                if (err) {
                    callback(err)
                }
                else callback(null, probeData);
            });
        },
        function(probeData, callback) {
            var duration = probeData.format.duration;
            var dateRecorded = "2008-11-11 13:23:44";
            var file = fs.createReadStream(filePath);
            var params = {
                Bucket: config.bucketName,
                Key: rawFile.originalname,
                Body: file,
            };
            console.log("uploading");
            s3.upload(params, function(err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                else {
                    var sqlData = {
                        'name': rawFile.originalname,
                        'size': rawFile.size,
                        'date_recorded': dateRecorded,
                        'duration': duration,
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
        else {
            res.send(results[0]);
        }
    });
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    async.parallel([
        function(callback) {
            var sql = "SELECT * FROM videos WHERE ID=" + id;
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
        else {
            res.send(results[0]);
        }
    });
});


module.exports = router;

