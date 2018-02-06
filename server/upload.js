const Multer = require('multer');
const config = require('./config');

var multer = Multer({
    dest: 'tmp/',
});

var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyID: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
});
var s3 = new AWS.S3();

async function uploadToS3(params) {
    return s3.upload(params).promise();
}

module.exports = ({
    uploadToS3: uploadToS3,
    multer: multer
});
