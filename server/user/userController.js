"use strict";

const userService = require("./userService");

module.exports = {

    registerNewUser: function(req, res) {
        userService.registerNewUser(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    loginUser: function(req, res) {
        userService.loginUser(req.body, (err, loginData, statusCode) => {
            if(loginData.data) {
                return res.set({"content-type": "application/json"}).header("x-access-token", loginData.data).status(statusCode).send(loginData.status);
            } else {
                return res.status(statusCode).send(loginData);
            }
        })
    }
}