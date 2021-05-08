"use strict";

const express = require("express");
const imageRouter = express.Router();
const imageController = require("./imageController");

imageRouter.post("/upload", (req, res) => {
    imageController.uploadSingleImage(req, res);
});

module.exports = {
    imageRouter: imageRouter
}