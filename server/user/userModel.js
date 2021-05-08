"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Location = require("../models/vendorLocationSchema");
const Address = require("../models/addressSchema");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firstName is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "lastName is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        index: true
    },
    mobileNumber: {
        type: String,
        required: [true, "mobile number is required"],
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    firebaseRegistrationToken: {
        type: String,
    },
    location: {
        type: Location.locationSchema,
        required: [true, "location is required"]
    },
    addressInfo: {
        type: Address.addressSchema,
    }
},{
    timestamps: true
});

userSchema.methods = {
    authenticate: async function(password, callback) {
        const isValidUser = await bcrypt.compare(password, this.password);
        if(isValidUser) {
            const token = jwt.sign({id: this._id}, jwtSecretKey);
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
}

module.exports = mongoose.mainConnection.model("Users", userSchema, "users");