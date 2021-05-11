"use strict";

const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const responseMessage = require("./responseMessage");
const imageConfig = require("../server/images/imageConfig.json");


function checkFileType(file, res, callback) {
    let response;
    const allowedMimitype = imageConfig.imageMimeType.values;
    const allowedExtensions = imageConfig.extensions.values;
    const imageExtension = path.extname(file.originalname).toLowerCase();
    const imageMimeType = file.mimetype;
    if (!allowedExtensions.includes(imageExtension) || !allowedMimitype.includes(imageMimeType)) {
        response = responseMessage.fileTypeNotAllowed;
        return res.status(response.code).send(response);
    }
    response = new responseMessage.GenericSuccessMessage();
    return callback(null, true);

}
module.exports = {

    isJWTAuthenticatedMW: function (req, res, next) {
        const requestUrl = req.protocol + "://" + req.host + req.originalUrl;
        console.log("Inside JWT Authentication process for: " + requestUrl);

        const token = req.headers["x-access-token"] || req.body.token || req.query.token;

        if (token) {
            jwt.verify(token, jwtSecretKey, (err, decoded) => {
                if (err) {
                    console.log("JWT Authentication failed for: " + requestUrl);
                    return res.status(responseMessage.missingOrBadAuthentication.code).send(responseMessage.missingOrBadAuthentication);
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            console.log("Authentication token not provided for: " + requestUrl);
            return res.status(responseMessage.missingOrBadAuthentication.code).send(responseMessage.missingOrBadAuthentication);
        }
    },

    
    // route middleware to make sure that the image file uploaded is valid.
    isValidImage: function (req, res, next) {
        let response;
        const upload = multer({
            fileFilter: function (req, file, callback) {console.log(file);
              checkFileType(file, res, callback);
            }
        }).single("image");
        upload(req, res, (err) => {
            try {
                if (err) {
                    console.log("Error ::: Image upload failed with error: "+JSON.stringify(err));
                    response = responseMessage.fileUploadFailed;
                    return res.status(response.code).send(response);
                } else {
                    next();
                }
            }catch(err) {
                console.log(err);
            }
            
        });
    },
}