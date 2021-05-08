"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: false,
    userName: {
        type: String,
        required: [true, "userName is required"]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "userId is required"]
    }
},{
    timestamps: true
});

module.exports = {
    UserSchema: userSchema
}