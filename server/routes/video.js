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

var connection = require('../db');

// when given params, upload file to aws and store the metadata in db as well as the direct aws file link
router.post('/', upload.single('file'), async (req, res, next) => {
    var duration, dateRecorded, name, size;
    if (req.body.duration) duration = req.body.duration;
    if (req.body.dateRecorded) dateRecorded = req.body.dateRecorded;
    const rawFile = req.file;
    const filePath = __dirname + "/../" + rawFile.path;
    try {
        var probeData = {
            "format": {
                "duration": 0,
            }
        };
        /* UNCOMMENT THIS ON LOCAL SERVER TO GET ACTUAL DURATION (COMMENTED BECAUSE DOES NOT WORK ON AWS)
        //let probeData = await probe(filePath)
        */
        if (duration == null && probeData != null && probeData.format != null && probeData.format.duration != null)
            duration = probeData.format.duration;
        // default date recorded value
        var file = fs.createReadStream(filePath);
        var stat = fs.statSync(filePath);
        console.log('stat:',stat);
        if (dateRecorded == null) dateRecorded = stat.ctime;
        var params = {
            Bucket: config.bucketName,
            Key: rawFile.originalname,
            Body: file,
        };
        if (dateRecorded == null) dateRecorded = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (duration == null) duration = 0;
        console.log("uploading");
        let sqlData = await s3.upload(params, function(err, data) {
            var sqlData = {
                'name': rawFile.originalname,
                'size': rawFile.size,
                'date_recorded': dateRecorded,
                'duration': duration,
                'url': data.Location,
            };
        });
        console.log("uploaded");
        var sql = "INSERT INTO videos (name, date_recorded, duration, size, url) VALUES ?";
        var values = [
            [sqlData.name, sqlData.date_recorded, sqlData.duration, sqlData.size, sqlData.url]
        ];
        let results = connection.query(sql, [values]);
        res.status(200).send(results[0]);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// returns all database video metadata
router.get('/', async (req, res, next) => {
    try {
        var sql = "SELECT * FROM videos";
        let results = await connection.query(sql);
        res.status(200).send(results[0])
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.get('/:id', async (req, res, next) => {
    var id = req.params.id;
    var sql = "SELECT * FROM videos WHERE ID=" + id;
    try {
        let results = await connection.query(sql);
        res.status(200).send(results[0]);
    } catch(err) {
        res.status(500).send(err);
    }
});


module.exports = router;

