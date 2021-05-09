"use strict";

const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const responseMessage = require("./responseMessage");
const imageConfig = require("../server/images/imageConfig.json");

module.exports = {

    isJWTAuthenticatedMW: function(req, res, next) {
        const requestUrl = req.protocol + "://" + req.host + req.originalUrl;
        console.log("Inside JWT Authentication process for: "+requestUrl);

        const token = req.headers["x-access-token"] || req.body.token || req.query.token;

        if(token) {
            jwt.verify(token, jwtSecretKey, (err, decoded) => {
                if(err) {
                    console.log("JWT Authentication failed for: "+requestUrl);
                    return res.status(responseMessage.missingOrBadAuthentication.code).send(responseMessage.missingOrBadAuthentication);
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            console.log("Authentication token not provided for: "+requestUrl);
            return res.status(responseMessage.missingOrBadAuthentication.code).send(responseMessage.missingOrBadAuthentication);
        }
    },

    isValidImage: function(req, res, next) {console.log(req.file);
        const upload = multer({
            fileFilter: function(req, file, callback) {console.log(file);
                callback(null, true);
            }
        }).single("file");
        upload(req, res, (err) => {console.log(err);
            if(err) {
                return res.status(err.code).send(err);
            } else {console.log(req.file);
                next();
            }
        })
    }
}