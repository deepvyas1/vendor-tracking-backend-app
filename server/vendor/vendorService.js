"use strict";

const Vendor = require("./vendorModel");
const responseMessage = require("../../utils/responseMessage");
const smsService = require("../../external/smsService");
const vendorConfig = require("./vendorConfig.json");
const mongoose = require("mongoose");

module.exports = {

    login: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const mobileNumber = body.mobileNumber;
            const otp = body.otp;

            if (!mobileNumber || !otp) {
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = { mobileNumber: mobileNumber, otp: otp };
            const updateObject = {
                $set: {
                    otp: null
                }
            }

            const result = await Vendor.findOne(query);
            if (result) {
                result.authenticate(async (err, data) => {
                    if (err) {
                        response = new responseMessage.GenericFailureMessage();
                        return callback(null, response, response.code);
                    }
                    response = new responseMessage.GenericSuccessMessage();
                    response.data = {
                        token: data,
                        vendorId: result._id,
                        createdBy: result.createdBy
                    };
                    const deleteOtp = await Vendor.findOneAndUpdate(query, updateObject);
                    return callback(null, response, response.code);
                });
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

    sendOtp: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const mobileNumber = body.mobileNumber;

            if (!mobileNumber) {
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const otp = parseInt(Math.random() * 100000);

            const query = { mobileNumber: mobileNumber };

            const updateObject = {
                $set: {
                    otp: otp
                }
            }

            const result = await Vendor.findOneAndUpdate(query, updateObject);
            if (result) {
                if (result.mobileNumber) {
                    smsService.sendOtp(mobileNumber, otp, (err, smsData) => {
                        if (!err && smsData.code === 200) {
                            response = new responseMessage.GenericSuccessMessage();
                            return callback(null, response, response.code);
                        } else {
                            response = new responseMessage.GenericFailureMessage();
                            return callback(null, response, response.code);
                        }
                    });
                }
            }else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },


    registerVendor: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {

            const name = body.name;
            const userName = body.userName;
            const vendorType = body.vendorType;
            const address = body.address;
            const imageUrl = body.imageUrl;
            const imageId = body.imageId;
            const license = body.license;
            const location = body.location;
            const mobileNumber = body.mobileNumber;
            const yearOfEstablishment = body.yearOfEstablishment;
            const openingTime = body.openingTime;
            const closingTime = body.closingTime;
            let locArray = [];

            if (!name || !vendorType || !license || !location || !mobileNumber || !userName) {
                console.log("Missing Info ::: name: " + name + ". vendorType: " + vendorType + ". license: " + license+". location: "+location
                +". mobileNumber: "+mobileNumber);
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            if (vendorType === vendorConfig.type.restaurant) {
                if (!address || !yearOfEstablishment || !location || !openingTime || !closingTime) {
                    response = new responseMessage.incorrectPayload;
                    return callback(null, response, response.code);
                }
            }

            const geoLocation = {
                type: "Point",
                coordinates: location
            }
            const userId = mongoose.Types.ObjectId();
            const createdBy = {
                userId: userId,
                userName: userName
            }
            const insertObject = new Vendor({
                name: name,
                createdBy: createdBy,
                vendorType: vendorType,
                addressInfo: address,
                imageUrl: imageUrl,
                imageId: imageId,
                license: license,
                location: geoLocation,
                yearOfEstablishment: yearOfEstablishment,
                openingTime: openingTime,
                mobileNumber: mobileNumber,
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
                console.log("Missing Info ::: name: " + name + ". createdBy: " + createdBy + ". name: " + name);
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

           
            const geoLocation = {
                type: "Point",
                coordinates: location
            }
            const updateObject = {
                $set: {
                    name: name,
                    addressInfo: address,
                    imageUrl: imageUrl,
                    imageId: imageId,
                    location: geoLocation,
                    openingTime: openingTime,
                    closingTime: closingTime,
                    updatedBy: createdBy
                }
            };
            const query = { _id: mongoose.Types.ObjectId(vendorId), "createdBy.userId": createdBy.userId };
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

    getAllVendors: async function (queryParams, callback) {
        console.log("Info ::: query recieved: " + JSON.stringify(queryParams));
        let response;
        try {
            const vendorType = queryParams.vt;

            if (parseInt(queryParams.limit) > 10) {
                console.log("Limit Exceeded: " + queryParams.limit);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            let query, vendorDetails = [];
            const page = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;

            if (vendorType === vendorConfig.type.restaurant || vendorType === vendorConfig.type.mobileVendor) {
                query = { vendorType: vendorType }
            } else {
                query = {};
            }
            const options = {
                page: page,
                limit: limit,
                sort: { likeCount: -1, createdAt: -1 }
            }

            const result = await Vendor.paginate(query, options);
            if (result) {
                const vendorDetail = JSON.parse(JSON.stringify(result.docs));
                vendorDetail.forEach(vendor => {
                    let vendorObj = _.omit(vendor, ['createdBy', 'updatedBy', 'otp', 'status', '__v']);
                    vendorDetails.push(vendorObj);
                });
                response = new responseMessage.GenericSuccessMessage();
                response.total = result.total;
                response.limit = result.limit;
                response.page = result.page;
                response.pages = result.pages;
                response.data = vendorDetails;
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

    getAllVendorsWithinPostal: async function (queryParams, callback) {
        console.log("Info ::: query recieved: " + JSON.stringify(queryParams));
        let response;
        try {
            const vendorType = queryParams.vt;
            const postalCode = queryParams.poc;

            if (parseInt(queryParams.limit) > 10 || !postalCode) {
                console.log("Limit Exceeded: " + queryParams.limit + ". postalCode: " + postalCode);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            let query, vendorDetails = [];
            const page = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;

            if (vendorType === vendorConfig.type.restaurant || vendorType === vendorConfig.type.mobileVendor) {
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
                sort: { likeCount: -1, createdAt: -1 }
            }

            const result = await Vendor.paginate(query, options);
            if (result) {
                const vendorDetail = JSON.parse(JSON.stringify(result.docs));
                vendorDetail.forEach(vendor => {
                    let vendorObj = _.omit(vendor, ['createdBy', 'updatedBy', 'otp', 'status', '__v']);
                    vendorDetails.push(vendorObj);
                });
                response = new responseMessage.GenericSuccessMessage();
                response.total = result.total;
                response.limit = result.limit;
                response.page = result.page;
                response.pages = result.pages;
                response.data = vendorDetails;
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

    getVendorDetail: async function (req, callback) {
        let response;
        try {
            const vendorId = req.query.vid;
            if (!vendorId) {
                console.log("Missing Info ::: vendorId: " + vendorId);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = {
                _id: mongoose.Types.ObjectId(vendorId),
                status: vendorConfig.status.active
            }

            const result = await Vendor.findOne(query);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                response.data = _.omit(JSON.parse(JSON.stringify(result)), ['createdBy', 'updatedBy', 'otp', 'status']);
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.ObjectDoesNotExistInDB();
                return callback(null, response, response.code);
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    getAllNearByVendor: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try {
            const userLocation = body.userLocation;
            if(!userLocation) {
                console.log("Missing Info ::: userLocation: "+userLocation);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = {
                location: {
                    $nearSphere: {
                        $geometry: {type: "Point", coordinates: userLocation},
                        $maxDistance: 2000
                    }
                }
            };

            const result = await Vendor.find(query);
            let vendorDetails = [];
            if(result) {
                const nearByVendors = JSON.parse(JSON.stringify(result));
                nearByVendors.forEach(vendor => {
                    let vendorObj = _.omit(vendor, ['createdBy', 'otp', 'updatedBy', 'status']);
                    vendorDetails.push(vendorObj);
                });
                response = new responseMessage.GenericSuccessMessage();
                response.data = vendorDetails;
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.ObjectDoesNotExistInDB();
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
            if (updateType === "increment") {
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
            const query = { _id: mongoose.Types.ObjectId(vendorId) }
            const result = await Vendor.findOneAndUpdate(query, updateObject);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(response, null);
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(response, null);
        }
    },

    updateLikeDislikeCount: async function (vendorId, updateType, updateFor, updatedBy, callback) {
        let response;
        try {
            let updateObject;
            if (updateType === "both") {
                if (updateFor === "like") {
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
            } else if (updateType === "single") {
                if (updateFor === "like") {
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
                if (updateFor === "like") {
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
            const query = { _id: mongoose.Types.ObjectId(vendorId) }
            const result = await Vendor.findOneAndUpdate(query, updateObject);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(response, null);
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(response, null);
        }
    },

}