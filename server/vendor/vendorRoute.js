"use strict";

const express = require("express");
const vendorRouter = express.Router();
const vendorFeedRouter = express.Router();
const vendorController = require("./vendorController");

vendorFeedRouter.post("/create/new", (req, res) => {
    vendorController.registerNewVendor(req, res);
});

vendorRouter.post("/update", (req, res) => {
    vendorController.updateVendor(req, res);
});

vendorFeedRouter.get("/all/get", (req, res) => {
    vendorController.getAllVendors(req, res);
});

vendorFeedRouter.get("/all/postal/get", (req, res) => {
    vendorController.getAllVendorsWithinPostal(req, res);
});

vendorFeedRouter.get("/detail/get", (req, res) => {
    vendorController.getVendorDetail(req, res);
});

vendorFeedRouter.post("/login", (req, res) => {
    vendorController.login(req, res);
});

vendorFeedRouter.post("/send/otp", (req, res) => {
    vendorController.sendOtp(req, res);
});

vendorFeedRouter.post("/near/all", (req, res) => {
    vendorController.getNearByVendors(req, res);
})


module.exports = {
    vendorRouter: vendorRouter,
    vendorFeedRouter: vendorFeedRouter
}