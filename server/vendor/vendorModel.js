"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const vendorConfig = require("./vendorConfig.json");
const Location = require("../models/vendorLocationSchema");
const Address = require("../models/addressSchema");
const User = require("../models/userSchema").UserSchema;

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Restaurant Name is required"],
        maxlength: 20,
        trim: true
    },
    createdBy: {
        type: User,
        required: [true, "User is required"],
    },
    vendorType: {
        type: String,
        required: [true, "vendor type is required"],
        enum: vendorConfig.type.values
    },
    addressInfo: {
        type: Address.addressSchema,
    },
    dishCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId
    },
    vendorStatus: {
        type: String,
        default: vendorConfig.status.open,
        enum: vendorConfig.vendorStatus.values
    },
    location: {
        type: Location.locationSchema,
    },
    license: {
        type: String,
        unique: true
    },
    yearOfEstablishment: {
        type: String
    },
    openingTime: {
        type: String
    },
    closingTime: {
        type: String
    },
    updatedBy: {
        type: User
    },
    status: {
        type: String,
        default: vendorConfig.status.active,
        enum: vendorConfig.status.values
    }
},{
    timestamps: true
});

vendorSchema.index({license: 1}, {unique: true});
vendorSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model("Vendors", vendorSchema, "vendors");
