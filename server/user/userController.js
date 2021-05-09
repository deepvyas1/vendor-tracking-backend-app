"use strict";

const userService = require("./userService");
const responseMessage = require("../../utils/responseMessage");

module.exports = {

    registerNewUser: function(req, res) {
        userService.registerNewUser(req.body, (err, data, statusCode) => {
            return res.status(statusCode).send(data);
        });
    },

    loginUser: function(req, res) {
        userService.loginUser(req.body, (err, loginData, statusCode) => {
            if(loginData.data) {
                const response = new responseMessage.GenericSuccessMessage();
                response.data = loginData.data;
                return res.status(statusCode).send(response);
            } else {
                return res.status(statusCode).send(loginData);
            }
        })
    }
}