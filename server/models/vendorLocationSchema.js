"use strict";

const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    _id: false,
    longitude: {
        type: String,
        required: [true, "longitude is required"]
    },
    latitude: {
        type: String,
        required: [true, "latitude is required"]
    }
});

module.exports = {
    locationSchema: locationSchema
};