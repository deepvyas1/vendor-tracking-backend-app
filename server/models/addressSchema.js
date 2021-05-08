"use strict";

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, "city is required"]
    },
    state: {
        type: String,
        required: [true, "state is required"]
    },
    address: {
        type: String,
        required: [true, "address is required"]
    },
    postalCode: {
        type: String,
        required: [true, "postal code is required"]
    }
},{
    timestamps: true
});

module.exports = {
    addressSchema: addressSchema
}