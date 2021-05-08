"use strict";

const dishesService = require("./dishesService");
const vendorService = require("../vendor/vendorService");

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
        dishesService.getAllVendorDishes(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    }
}