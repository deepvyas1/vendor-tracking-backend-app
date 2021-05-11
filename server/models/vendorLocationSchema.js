"use strict";

const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    _id: false,
    longitude: {
        type: Number,
        required: [true, "longitude is required"]
    },
    latitude: {
        type: Number,
        required: [true, "latitude is required"]
    }
});

module.exports = {
    locationSchema: locationSchema
};