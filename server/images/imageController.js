"use strict";

const imageService = require("./imageService");

module.exports = {

    uploadSingleImage: function(req, res) {
        imageService.uploadSingleImage(req, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        })
    }
}