"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const vendorUser = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"]
    },
    mobileNumber: {
        type: String,
        required: [true, "mobileNumber is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    name: {
        type: String,
        required: [true, "name is required"]
    }
},{
    timestamps: true
});

vendorUser.methods = {
    authenticate: async function(password, callback) {
        const isValidUser = await bcrypt.compare(password, this.password);
        if(result) {
            const token = jwt.sign(this._id, jwtSecretKey);
            return callback(null, token);
        } else {
            const response = {
                code: 400,
                status: "failure",
                message: "UserName or Paswword is incorrect"
            };
            return callback(response, null);
        }
    }
};

module.exports = mongoose.mainConnection.model("VendorUser", vendorUser, "vendor_users");