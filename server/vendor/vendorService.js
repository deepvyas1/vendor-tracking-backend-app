"use strict";

const Vendor = require("./vendorModel");
const responseMessage = require("../../utils/responseMessage");
const vendorConfig = require("./vendorConfig.json");
const mongoose = require("mongoose");

module.exports = {

    registerVendor: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {

            const name = body.name;
            const createdBy = body.createdBy;
            const vendorType = body.vendorType;
            const address = body.address;
            const imageUrl = body.imageUrl;
            const imageId = body.imageId;
            const license = body.license;
            const location = body.location;
            const yearOfEstablishment = body.yearOfEstablishment;
            const openingTime = body.openingTime;
            const closingTime = body.closingTime;

            if (!name && !createdBy && !vendorType && !license) {
                console.log("Missing Info ::: name: " + name + ". createdBy: " + createdBy + ". vendorType: " + vendorType + ". license: " + license);
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            if (vendorType === vendorConfig.type.restaurant) {
                if (!address && !yearOfEstablishment && !location && openingTime && closingTime) {
                    response = new responseMessage.incorrectPayload;
                    return callback(null, response, response.code);
                }
            }
            const insertObject = new Vendor({
                name: name,
                createdBy: createdBy,
                vendorType: vendorType,
                addressInfo: address,
                imageUrl: imageUrl,
                imageId: imageId,
                license: license,
                location: location,
                yearOfEstablishment: yearOfEstablishment,
                openingTime: openingTime,
                closingTime: closingTime
            });

            const result = await insertObject.save();
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                response.data = result._id;
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }

        } catch (err) {
            if (err.code === 11000) {
                response = responseMessage.restaurantAlreadyExist;
                return callback(null, response, response.code);
            }
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    updateVendor: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {

            const vendorId = body.vendorId;
            const name = body.name;
            const createdBy = body.createdBy;
            const address = body.address;
            const imageUrl = body.imageUrl;
            const imageId = body.imageId;
            const location = body.location;
            const openingTime = body.openingTime;
            const closingTime = body.closingTime;

            if (!vendorId) {
                console.log("Missing Info ::: name: " + name + ". createdBy: " + createdBy + ". vendorType: " + vendorType + ". license: " + license);
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const updateObject = {
                $set: {
                    name: name,
                    updatedBy: createdBy,
                    addressInfo: address,
                    imageUrl: imageUrl,
                    imageId: imageId,
                    location: location,
                    openingTime: openingTime,
                    closingTime: closingTime
                }
            };
            const query = { _id: mongoose.Types.ObjectId(vendorId) };
            const result = await Vendor.findOneAndUpdate(query, updateObject);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }

        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    getAllVendors: async function(queryParams, callback) {
        console.log("Info ::: query recieved: "+JSON.stringify(queryParams));
        let response;
        try {
            const vendorType = queryParams.vt;

            if(parseInt(queryParams.limit) > 10) {
                console.log("Limit Exceeded: "+queryParams.limit);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            let query;
            const page = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;

            if(vendorType === vendorConfig.type.restaurant || vendorType === vendorConfig.type.mobileVendor) {
                query = {vendorType: vendorType}
            } else {
                query = {};
            }
            const options = {
                page: page,
                limit: limit,
                sort: {likeCount: -1, createdAt: -1}
            }

            const result = await Vendor.paginate(query, options);
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                response.total = result.total;
                response.limit = result.limit;
                response.page = result.page;
                response.pages = result.pages;
                response.data = result.docs;
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    getAllVendorsWithinPostal: async function(queryParams, callback) {
        console.log("Info ::: query recieved: "+JSON.stringify(queryParams));
        let response;
        try {
            const vendorType = queryParams.vt;
            const postalCode = queryParams.poc;

            if(parseInt(queryParams.limit) > 10 || !postalCode) {
                console.log("Limit Exceeded: "+queryParams.limit+". postalCode: "+postalCode);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            let query;
            const page = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;

            if(vendorType === vendorConfig.type.restaurant || vendorType === vendorConfig.type.mobileVendor) {
                query = {
                    "addressInfo.postalCode": postalCode,
                    vendorType: vendorType
                }
            } else {
                query = {
                    "addressInfo.postalCode": postalCode
                };
            }
            const options = {
                page: page,
                limit: limit,
                sort: {likeCount: -1, createdAt: -1}
            }

            const result = await Vendor.paginate(query, options);
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                response.total = result.total;
                response.limit = result.limit;
                response.page = result.page;
                response.pages = result.pages;
                response.data = result.docs;
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    
    updateVendorDishCount: async function (vendorId, updatedBy, updateType, callback) {
        let response;
        try {
            let updateObject;
            if(updateType === "increment") {
                updateObject = {
                    $set: {
                        updatedBy: updatedBy
                    },
                    $inc: {
                        dishCount: 1
                    }
                }
            } else {
                updateObject = {
                    $set: {
                        updatedBy: updatedBy
                    },
                    $inc: {
                        dishCount: -1
                    }
                }
            }
            const query = {_id: mongoose.Types.ObjectId(vendorId)}
            const result = await Vendor.findOneAndUpdate(query, updateObject);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(response, null);
            }
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(response, null);
        }
    },

    updateLikeDislikeCount: async function(vendorId, updateType, updateFor, updatedBy, callback) {
        let response;
        try {
            let updateObject;
            if(updateType === "both") {
                if(updateFor === "like") {
                    updateObject = {
                        $set: {
                            updatedBy: updatedBy
                        },
                        $inc: {
                            likeCount: 1,
                            dislikeCount: -1
                        }
                    }
                } else {
                    updateObject = {
                        $set: {
                            updatedBy: updatedBy
                        },
                        $inc: {
                            dislikeCount: 1,
                            likeCount: -1
                        }
                    }
                }
            } else if(updateType === "single") {
                if(updateFor === "like") {
                    updateObject = {
                        $set: {
                            updatedBy: updatedBy
                        },
                        $inc: {
                            likeCount: 1
                        }
                    }
                } else {
                    updateObject = {
                        $set: {
                            updatedBy: updatedBy
                        },
                        $inc: {
                            dislikeCount: 1
                        }
                    }
                }
            } else {
                if(updateFor === "like") {
                    updateObject = {
                        $set: {
                            updatedBy: updatedBy
                        },
                        $inc: {
                            likeCount: -1
                        }
                    }
                } else {
                    updateObject = {
                        $set: {
                            updatedBy: updatedBy
                        },
                        $inc: {
                            dislikeCount: -1
                        }
                    }
                }
            }
            const query = {_id: mongoose.Types.ObjectId(vendorId)}
            const result = await Vendor.findOneAndUpdate(query, updateObject);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(response, null);
            }
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(response, null);
        }
    },
    
}