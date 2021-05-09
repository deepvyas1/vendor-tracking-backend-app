"use strict";

const responseMessage = require("../../utils/responseMessage");
const path = require("path");
const probe = require("probe-image-size");
const Image = require("./imageModel");
const awsService = require("../../external/awsService");

module.exports = {

    uploadSingleImage: function(req, callback) {
        console.log("Info ::: body received: " + JSON.stringify(req.body));
        let response;
        try {
            const body = req.body, file = req.file;
            const userName = body.userName;
            const userId = body.userId;

            if (!userName || !userId) {
                console.log("Missing Info ::: userName: " + userName + ". userId: " + userId);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const createdBy = {
                userId: userId,
                userName: userName
            };
            let insertObject, awsS3Object;

            // Calling API to upload image on S3 Bucket
            awsService.callSingleImageUpload(file, async (err, data) => {
                if (err) {
                    // If there was some error in uploading the image to S3
                    response = new responseMessage.GenericFailureMessage();
                    return callback(null, response, response.code);
                } else {

                    // This is the case when image is successfully uploaded. Uploaded data response from S3 is returned.
                    awsS3Object = {
                        key: data.Key,
                        s3Url: data.Location,
                        bucketName: data.Bucket,
                        etag: data.ETag.slice(1, -1),
                        cfUrl: cfImageUrl + data.Key
                    };

                    //This is to calculate the dimensions of the image from the cloudfront url.
                    const dimensions = await probe(awsS3Object.cfUrl);

                    //insertObject holds all the required values for an image
                    insertObject = {
                        uploadedBy: createdBy,
                        size: file.size,
                        extension: path.extname(file.originalname),
                        mimeType: file.mimetype,
                        encoding: file.encoding,
                        fileName: file.originalname,
                        height: dimensions.height,
                        width: dimensions.width,
                        imageInfo: awsS3Object
                    };
                    const result = await Image.create(insertObject);
                    if(result) {
                        //This is the case when details are inserted into the database successfully.
                        response = new responseMessage.GenericSuccessMessage();
                        response.data = {
                            imageId: result._id,
                            imageCfUrl: result.imageInfo.cfUrl,
                            imageS3Url: result.imageInfo.s3Url
                        };
                        return callback(null, response, response.code);
                    } else {
                        response = new responseMessage.GenericFailureMessage();
                        return callback(null, response, response.code);
                    }
                }
            });
        } catch (err) {
            console.log(`ERROR :::  error ${err.message}, stack: ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    }
}