"use strict";

const aws = require("aws-sdk");

const s3 = new aws.S3({
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey
});

function upload(params, callback) {
    s3.upload(params, function(s3Err, data) {
        if(s3Err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    }); 
}

module.exports = {

    callSingleImageUpload: function(file, callback) {
        const params = {
            Bucket: "imagesbuckets3",
            ContentType: file.mimetype,
            Body: file.buffer,
            Key: "images/" + Date.now() + '_' + file.originalname.replace(/\s+/g, "_")
        };
        upload(params, callback);
    }
}
