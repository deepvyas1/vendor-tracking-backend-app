"use strict";

const userService = require("./userService");
const responseMessage = require("../../utils/responseMessage");

module.exports = {

    updateUser: function(req, res) {
        userService.updateUser(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    loginUser: function(req, res) {
        userService.loginUser(req.body, (err, loginData, statusCode) => {
            return res.status(statusCode).send(loginData);
        });
    },

    sendOtp: function(req, res) {
        userService.sendOtp(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    getUserDetail: function(req, res) {
        userService.getUserDetail(req, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    loginUserWithGoogle: function(req, res) {
        userService.loginWithGoogle(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    }
}