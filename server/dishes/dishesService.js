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

            if(!vendorId || !name || !price || !dishType || !createdBy || !vendorType) {
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
            const updateCount = body.updateCount;
            const createdBy = body.createdBy;

            if(!dishId ||!updateCount || !createdBy) {
                console.log("Missing Info ::: dishId: "+dishId+". updateCount: "+updateCount+". createdBy: "+createdBy);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            let updateObject = {
                $set: {
                    dishAvailability: updateCount
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
            const vendorId = queryParams.vid;
            const sortBy = queryParams.sort;

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

    getDishDetail: async function(req, callback) {
        console.log("Info ::: queryParams recieved: "+JSON.stringify(req.query));
        let response;
        try {
            const dishId = req.query.did;
            if(!dishId) {
                console.log("Missing Info ::: dishId: "+dishId);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = {
                _id: mongoose.Types.ObjectId(dishId),
                status: dishesConfig.status.active
            }

            const result = await Dishes.findOne(query);
            if(result) {
                response = new responseMessage.GenericSuccessMessage();
                response.data = result;
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.ObjectDoesNotExistInDB();
                return callback(null, response, response.code);
            }
        }catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    getAllDishes: async function(req, callback) {
        let response;
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const query = {};
            const options = {
                page: page,
                limit: limit,
                sort: {likeCount: -1}
            }
            console.log("here");
            let dishesIndex = {}, index = 0, dishIds = [];
            const result = await Dishes.paginate(query, options);
            if(result) {
                const dishesDetail = JSON.parse(JSON.stringify(result.docs));
                const dishDetails = dishesDetail.map(dish => {
                    dishesIndex[dish._id] = index;
                    index++;
                    dishIds.push(dish._id);
                    dish.hasUserLiked = false;
                    dish.hasUserDisliked = false;
                    return dish;
                });
               
                response = new responseMessage.GenericSuccessMessage();
                response.total = result.total;
                response.limit = result.limit;
                response.page = result.page;
                response.pages = result.pages;
                response.data = {
                    dishesIndex: dishesIndex,
                    dishDetails: dishDetails,
                    dishIds: dishIds
                };
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