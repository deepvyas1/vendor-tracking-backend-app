"use strict";

const express = require("express");
const vendorRouter = express.Router();
const vendorController = require("./vendorController");

vendorRouter.post("/create/new", (req, res) => {
    vendorController.registerNewVendor(req, res);
});

vendorRouter.post("/update", (req, res) => {
    vendorController.updateVendor(req, res);
});

vendorRouter.get("/all/get", (req, res) => {
    vendorController.getAllVendors(req, res);
});

vendorRouter.get("/all/postal/get", (req, res) => {
    vendorController.getAllVendorsWithinPostal(req, res);
});


module.exports = {
    vendorRouter: vendorRouter
}