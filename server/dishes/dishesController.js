"use strict";

const dishesService = require("./dishesService");
const vendorService = require("../vendor/vendorService");
const likeService = require("../like/likeService");
const likeConfig = require("../like/likeConfig.json");
const responseMessage = require("../../utils/responseMessage");
const { response } = require("express");

module.exports = {

    insertNewDish: function(req, res) {
        dishesService.insertNewDish(req.body, (err, data, statusCode) => {

            if(!err && statusCode === 200 && data.status !== "not_found") {
                vendorService.updateVendorDishCount(req.body.vendorId, req.body.createdBy, "increment", (err, vendorData) => {
                    if(err) {
                        return res.status(err.code).send(err);
                    } else {
                        return res.status(vendorData.code).send(vendorData);
                    }
                });
            } else {
                return res.status(statusCode).send(data);
            }
        });
    },

    updateDish: function(req, res) {
        dishesService.updateDish(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    updateDishAvailability: function(req, res) {
        dishesService.updateDishAvailablity(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    deleteDish: function(req, res) {
        dishesService.deleteDish(req.body, (err, data, statusCode) => {
            if(!err && statusCode === 200 && data.status !== "not_found") {
                vendorService.updateVendorDishCount(data.vendorId, req.body.createdBy, "decrement", (err, vendorData) => {
                    if(err) {
                        return res.status(err.code).send(err);
                    } else {
                        return res.status(vendorData.code).send(vendorData);
                    }
                });
            } else {
                return res.status(statusCode).send(data);
            }
            
        });
    },

    getAllVendorDishes: function(req, res) {
        dishesService.getAllVendorDishes(req.query, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getDishDetail: function(req, res) {
        dishesService.getDishDetail(req, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getAllDishes: function(req, res) {
        let response;
        dishesService.getAllDishes(req, (err, dishData, statusCode) => {
            if(!err && dishData.code === 200 && dishData.status !== "not_found") {console.log("Here");
                const userId = req.query.uid;
                const dishesIndex = dishData.data.dishesIndex;
                let dishDetails = dishData.data.dishDetails;
                const dishIds = dishData.data.dishIds;
                let index;
                if(userId) {
                    likeService.getUserLikedDishes(dishIds, userId, (err, likeData) => {
                        if(!err && likeData.status !== "not_found" && likeData.code === 200) {console.log(likeData);
                            likeData.data.forEach(element => {
                                index = dishesIndex[element.flowId];
                                if(element.reactionType === likeConfig.reaction.like) {
                                    dishDetails[index].hasUserLiked = true;
                                } else if(element.reactionType === likeConfig.reaction.dislike) {
                                    dishDetails[index].hasUserDisliked = true;
                                }
                            });
                        }
                    });
                    response = new responseMessage.GenericSuccessMessage();
                    response.total = dishData.total;
                    response.limit = dishData.limit;
                    response.page = dishData.page;
                    response.pages = dishData.pages;
                    response.data = dishDetails;
                    return res.status(response.code).send(response);
                } else {
                    return res.status(statusCode).send(dishData);
                }
            } else {
                return res.status(statusCode).send(dishData);
            }
        });
    }
}