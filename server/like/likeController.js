"use strict";

const likeService = require("./likeService");
const likeConfig = require("./likeConfig.json");

module.exports = {

    likeVendor: function(req, res) {
        req.body.flowType = likeConfig.flow.vendor;
        req
        likeService.likeDislikeDishVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    likeDish: function(req, res) {
        req.body.flowType = likeConfig.flow.dish;
        likeService.likeDislikeDishVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    dislikeVendor: function(req, res) {
        req.body.flowType = likeConfig.flow.vendor;
        likeService.likeDislikeDishVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    dislikeDish: function(req, res) {
        req.body.flowType = likeConfig.flow.dish;
        likeService.likeDislikeDishVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    deleteVendorReaction: function(req, res) {
        req.body.flowType = likeConfig.flow.vendor;
        likeService.deleteLikeDislike(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    deleteDishReaction: function(req, res) {
        req.body.flowType = likeConfig.flow.dish;
        likeService.deleteLikeDislike(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

}