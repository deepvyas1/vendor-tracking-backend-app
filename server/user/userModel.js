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
        index: true
    },
    mobileNumber: {
        type: String,
        index: true
    },
    password: {
        type: String,
    },
    firebaseRegistrationToken: {
        type: String,
    },
    location: {
        type: Location.locationSchema,
    },
    addressInfo: {
        type: Address.addressSchema,
    },
    otp: {
        type: Number
    }
},{
    timestamps: true
});

userSchema.methods = {
    authenticate: async function(callback) {
        //const isValidUser = await bcrypt.compare(password, this.password);
        const token = jwt.sign({id: this._id}, jwtSecretKey);
        return callback(null, token);
    }
}

module.exports = mongoose.mainConnection.model("Users", userSchema, "users");