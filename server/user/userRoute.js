"use strict";

const express = require("express");
const userRouter = express.Router();
const userController = require("./userController");

userRouter.post("/login", (req, res) => {
    userController.loginUser(req, res);
});

userRouter.post("/signup", (req, res) => {
    userController.registerNewUser(req, res);
});

module.exports = {
    userRouter: userRouter
}

