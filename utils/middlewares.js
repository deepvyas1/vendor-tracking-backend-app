"use strict";

const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const responseMessage = require("./responseMessage");
const imageConfig = require("../server/images/imageConfig.json");

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
            fileFilter: function (req, file, callback) {
                const allowedMimitype = imageConfig.imageMimeType.values;
                const allowedExtensions = imageConfig.extensions.values;
                const imageExtension = path.extname(file.originalname).toLowerCase();
                const imageMimeType = file.mimetype;
                if (!allowedExtensions.includes(imageExtension) || !allowedMimitype.includes(imageMimeType)) {
                    response = responseMessage.fileTypeNotAllowed;
                    return callback(response, null);
                }
                return callback(null, true);
            }
        }).single("image");
        upload(req, res, (err) => {
            if (err) {
                return res.status(err.code).send(err);
            } else {
                next();
            }
        })
    },
}