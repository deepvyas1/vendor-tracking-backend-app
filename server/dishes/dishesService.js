"use strict";

const Dishes = require("./dishesModel");
const responseMessage = require("../../utils/responseMessage");
const mongoose = require("mongoose");
const dishesConfig = require("./dishesConfig.json");

module.exports = {

    insertNewDish: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try {
            const vendorId = body.vendorId;
            const name = body.name;
            const description = body.description;
            const price = body.price;
            const dishType = body.dishType;
            const imageUrl = body.imageUrl;
            const imageId = body.imageId;
            const dishAvailability = body.dishAvailability;
            const vendorType = body.vendorType;
            const createdBy = body.createdBy;

            if(!vendorId || !name || !price || !dishType || !createdBy) {
                console.log("Missing Info ::: vendorId: "+vendorId+". name: "+name+". price: "+price+". dishType: "+dishType
                +". createdBy: "+createdBy);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            if(vendorType === "mobileVendor") {
                if(!dishAvailability) {
                    console.log("Missing Info ::: dishAvailability: "+dishAvailability);
                    response = responseMessage.incorrectPayload;
                    return callback(null, response, response.code);
                }
            }

            const insertObject = new Dishes({
                name: name,
                vendorId: vendorId,
                description: description,
                price: price,
                dishType: dishType,
                imageUrl: imageUrl,
                imageId: imageId,
                dishAvailability: dishAvailability,
                createdBy: createdBy
            });

            const result = await insertObject.save();
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch(err) {

            if(err.code === 11000) {
                response = responseMessage.dishAlreadyExist;
                return callback(null, response, response.code);
            }
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    updateDish: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try {
            const name = body.name;
            const description = body.description;
            const price = body.price;
            const dishType = body.dishType;
            const imageUrl = body.imageUrl;
            const imageId = body.imageId;
            const dishId = body.dishId;
            const createdBy = body.createdBy;

            if(!dishId ||!name || !price || !dishType || !createdBy) {
                console.log("Missing Info ::: dishId: "+dishId+". name: "+name+". price: "+price+". dishType: "+dishType
                +". createdBy: "+createdBy.userId);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const updateObject = {
                name: name,
                description: description,
                price: price,
                dishType: dishType,
                imageUrl: imageUrl,
                imageId: imageId,
                updatedBy: createdBy
            };
            const query = {
                _id: mongoose.Types.ObjectId(dishId),
                status: dishesConfig.status.active,
                "createdBy.userId": createdBy.userId
            }

            const result = await Dishes.findOneAndUpdate(query, updateObject);
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch(err) {

            if(err.code === 11000) {
                response = responseMessage.dishAlreadyExist;
                return callback(null, response, response.code);
            }
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    updateDishAvailablity: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try {
            const dishId = body.dishId;
            const updateType = body.updateType;
            const createdBy = body.createdBy;

            if(!dishId ||!updateType || !createdBy) {
                console.log("Missing Info ::: dishId: "+dishId+". updateType: "+updateType+". createdBy: "+createdBy);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            let updateObject;
            if(updateType === "increment") {
                updateObject = {
                    $set: {
                        updatedBy: createdBy
                    },
                    $inc: {
                        dishAvailability: 1
                    }
                }
            } else if(updateType === "decrement") {
                updateObject = {
                    $set: {
                        updatedBy: createdBy
                    },
                    $inc: {
                        dishAvailability: -1
                    }
                }
            }
            const query = {
                _id: mongoose.Types.ObjectId(dishId),
                status: dishesConfig.status.active,
                "createdBy.userId": createdBy.userId
            }

            const result = await Dishes.findOneAndUpdate(query, updateObject);
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch(err) {

            if(err.code === 11000) {
                response = responseMessage.dishAlreadyExist;
                return callback(null, response, response.code);
            }
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    deleteDish: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try {
            const dishId = body.dishId;
            const createdBy = body.createdBy;

            if(!dishId ||!createdBy) {
                console.log("Missing Info ::: dishId: "+dishId+". createdBy: "+createdBy);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const updateObject = {
                $set: {
                    status: dishesConfig.status.deleted,
                    updatedBy: createdBy
                }
            };
           
            const query = {
                _id: mongoose.Types.ObjectId(dishId),
                status: dishesConfig.status.active,
                "createdBy.userId": createdBy.userId
            }

            const result = await Dishes.findOneAndUpdate(query, updateObject);
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                response.vendorId = result.vendorId;
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

    getAllVendorDishes: async function(queryParams, callback) {
        console.log("Info ::: query recieved: "+JSON.stringify(queryParams));
        let response;
        try {
            const vendorId = queryParams.vendorId;
            const sortBy = queryParams.sortBy;

            if(parseInt(queryParams.limit) > 10 || !vendorId) {
                console.log("Limit Exceeded: "+queryParams.limit+". vendorId: "+vendorId);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = {
                vendorId: mongoose.Types.ObjectId(vendorId),
                status: dishesConfig.status.active
            };
            const page = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;
            const sort = sortBy || "-likeCount";
            
            const options = {
                page: page,
                limit: limit,
                sort: sort
            }

            const result = await Dishes.paginate(query, options);
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

    updateLikeDislikeCount: async function(dishId, updateType, updateFor, updatedBy, callback) {
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
            } else if(updateType === "single"){
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
            }else {
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
            const query = {_id: mongoose.Types.ObjectId(dishId)}
            const result = await Dishes.findOneAndUpdate(query, updateObject);
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
    }
}