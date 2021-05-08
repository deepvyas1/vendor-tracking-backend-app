"use strict";

const express = require("express");
const likeRouter = express.Router();
const likeController = require("./likeController");

likeRouter.post("/vendor/like/new", (req, res) => {
    likeController.likeVendor(req, res);
});

likeRouter.post("/dish/like/new", (req, res) => {
    likeController.likeDish(req, res);
});

likeRouter.post("/vendor/dislike/new", (req, res) => {
    likeController.dislikeVendor(req, res);
});

likeRouter.post("/dish/dislike/new", (req, res) => {
    likeController.dislikeDish(req, res);
});

likeRouter.post("/vendor/delete", (req, res) => {
    likeController.deleteVendorReaction(req, res);
});

likeRouter.post("/dish/delete", (req, res) => {
    likeController.deleteDishReaction(req, res);
});

module.exports = {
    likeRouter: likeRouter
}