"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const dishesConfig = require("./dishesConfig.json");
const User = require("../models/userSchema").UserSchema;

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Dish name is required"],
    },
    createdBy: {
        type: User,
        required: [true, "createdBy is required"]
    },
    vendorId: {
        type: mongoose.Types.ObjectId,
        required: [true, "vendorId is required"],
        index: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true,
        maxlength: 50
    },
    dishAvailability: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    imageUrl: {
        type: String,
        default: ""
    },
    imageId: {
        type: mongoose.Types.ObjectId
    },
    dishType: {
        type: String,
        required: [true, "dishType is required"],
        enum: dishesConfig.type.values

    },
    status: {
        type: String,
        default: dishesConfig.status.active,
        enum: dishesConfig.status.values
    },
    updatedBy: {
        type: User
    }
}, {
    timestamps: true
});

dishSchema.index({vendorId: 1, name: 1}, {unique: true});
dishSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model("Dishes", dishSchema, "dishes");
