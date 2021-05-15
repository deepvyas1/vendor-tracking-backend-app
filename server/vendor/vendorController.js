"use strict";

const vendorService = require("./vendorService");

module.exports = {

    registerNewVendor: function(req, res) {
        vendorService.registerVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    updateVendor: function(req, res) {
        vendorService.updateVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getAllVendors: function(req, res) {
        vendorService.getAllVendors(req.query, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getAllVendorsWithinPostal: function(req, res) {
        vendorService.getAllVendorsWithinPostal(req.query, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getVendorDetail: function(req, res) {
        vendorService.getVendorDetail(req, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    login: function(req, res) {
        vendorService.login(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    sendOtp: function(req, res) {
        vendorService.sendOtp(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getNearByVendors:  function(req, res) {
        vendorService.getAllNearByVendor(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    }
}