const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require('../config');
const probe = require('node-ffprobe');
const upload = require('../upload');
const validator = require('../validator');


let connection = require('../db');

// when given params, upload file to aws and store the metadata in db as well as the direct aws file link
router.post('/', upload.multer.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        const filePath = __dirname + "/../" + file.path;

        let probeData = await new Promise((resolve, reject) => {
            probe(filePath, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        let duration = probeData.format.duration;

        let stream = fs.createReadStream(filePath);
        let stat = fs.statSync(filePath);

        let dateRecorded = stat.ctime;
        let params = {
            Bucket: config.bucketName,
            Key: file.originalname,
            Body: stream,
        };
        //if (dateRecorded == null) dateRecorded = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //if (duration == null) duration = 0;
        let s3Data = await upload.uploadToS3(params);
        let sqlData = {
            'name': file.originalname,
            'size': file.size,
            'date_recorded': dateRecorded,
            'duration': duration,
            'url': s3Data.Location,
        };
        console.log("uploaded");

        let results = await connection.query(
            "INSERT INTO videos (name, date_recorded, duration, size, url) VALUES ?",
            [sqlData.name, sqlData.date_recorded, sqlData.duration, sqlData.size, sqlData.url]);

        res.status(201).send(results[0]);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// returns all database video metadata
router.get('/', async (req, res, next) => {
    try {
        let results = await connection.query('SELECT * FROM videos');
        res.status(200).send(results[0])
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let results = await connection.query('SELECT * FROM videos WHERE ID=' + id);
        res.status(200).send(results[0]);
    } catch(err) {
        res.status(500).send(err);
    }
});


module.exports = router;

