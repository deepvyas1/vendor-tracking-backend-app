"use strict";

const mongoose = require("mongoose");
const User = require("../models/userSchema").UserSchema;
const AwsS3Upload = require("../models/awsSchema").awsS3Schema;
const imageConfig = require("./imageConfig.json");

const imageSchema = new mongoose.Schema({
    uploadedBy: {
        type: User,
        required: [true, "Image uploaded by is required"]
    },
    mimeType: {
        type: String,
        required: [true, "Image Mimetype is required"],
        enum: imageConfig.imageMimeType.values
    },
    encoding: {
        type: String,
        required: [true, "Image encoding is required"]
    },
    height: {
        type: Number,
        required: [true, "Image height is required"]
    },
    width: {
        type: Number,
        required: [true, "Image width is required"]
    },
    size: {
        type: Number,
        required: [true, "Image Size is required"]
    },
    imageInfo: {
        type: AwsS3Upload,
        required: [true, "Image url is required"]
    },
    fileName: {
        type: String,
        required: [true, "Image filename is required"]
    },
    extension: {
        type: String,
        enum: imageConfig.extensions.values
    },
    status: {
        type: String,
        default: imageConfig.status.active,
        enum: imageConfig.status.values
    }
},{
    timestamps: true
});

module.exports = mongoose.mainConnection.model("PostImage", imageSchema, "post_images");