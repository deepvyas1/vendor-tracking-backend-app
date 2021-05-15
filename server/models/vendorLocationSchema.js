"use strict";

const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    _id: false,
    type: {
        type: String
    },
    coordinates: {
        type: [Number],
        required: [true, "location info is required"],
        default: []
    }
});

module.exports = {
    locationSchema: locationSchema
};