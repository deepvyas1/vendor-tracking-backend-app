"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const likeConfig = require("./likeConfig.json");
const User = require("../models/userSchema");

const likeSchema = new mongoose.Schema({
    createdBy: {
        type: User,
        required: [true, "User is required"]
    },
    flowId: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true
    },
    flowType: {
        type: String,
        required: [true, "flowType is required"],
        enum: likeConfig.flow.values
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },
    reactionType: {
        type: String,
        required: [true, "reaction is required"],
        enum: likeConfig.reaction.values
    },
    status: {
        type: String,
        default: likeConfig.status.active,
        enum: likeConfig.status.values
    },
    updatedBy: {
        type: User
    }
    
},{
    timestamps: true
});

likeSchema.plugin(mongoosePaginate);
likeSchema.index({"createdBy.userId": 1});

module.exports = mongoose.mainConnection.model("Review", likeSchema, "reviews");