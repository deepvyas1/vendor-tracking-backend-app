"use strict";

const express = require("express");
const userRouter = express.Router();
const userController = require("./userController");

userRouter.post("/login", (req, res) => {
    userController.loginUser(req, res);
});

userRouter.post("/update", (req, res) => {
    userController.updateUser(req, res);
});

userRouter.post("/send/otp", (req, res) => {
    userController.sendOtp(req, res);
});

userRouter.get("/details", (req, res) => {
    userController.getUserDetail(req, res);
});

module.exports = {
    userRouter: userRouter
}

