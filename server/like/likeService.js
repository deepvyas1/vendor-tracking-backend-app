"use strict";

const mongoose = require("mongoose");
const likeConfig = require("./likeConfig.json");
const Like = require("./likeModel");
const vendorService = require("../vendor/vendorService");
const dishesService = require("../dishes/dishesService");
const responseMessage = require("../../utils/responseMessage");

module.exports = {

    likeDislikeDishVendor: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const flowId = body.flowId;
            const createdBy = body.createdBy;
            const flowType = body.flowType;
            const message = body.message;
            const reactionType = body.reactionType;

            if (!flowId || !reactionType || !flowType || !createdBy || !createdBy.userId || !createdBy.userName) {
                console.log("Missing Info ::: flowIdId: " + flowId + ". reactionType: " + reactionType + ". createdBy: " + createdBy
                    + ". createdBy.userId: " + createdBy.userId + ". flowType: " + flowType);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const updateObject = {
                $set: {
                    createdBy: createdBy,
                    flowId: flowId,
                    flowType: flowType,
                    message: message,
                    status: likeConfig.status.active,
                    reactionType: reactionType,
                }
            };
            const query = {
                flowId: mongoose.Types.ObjectId(flowId),
                "createdBy.userId": createdBy.userId,
            }

            const result = await Like.findOneAndUpdate(query, updateObject, { upsert: true });
            if (result !== null) {
                const oldStatus = result.reactionType;
                if (oldStatus !== null) {
                    if (reactionType === likeConfig.reaction.dislike && oldStatus !== likeConfig.reaction.dislike) {
                        if (flowType === likeConfig.flow.vendor) {
                            vendorService.updateLikeDislikeCount(flowId, "both", likeConfig.reaction.dislike, createdBy, (err, data) => {
                                if (err) {
                                    console.log("Error ::: while disliking the flowId");
                                    return callback(null, err, err.code);
                                }
                                return callback(null, data, data.code);
                            });
                        } else if (flowType === likeConfig.flow.dish) {
                            dishesService.updateLikeDislikeCount(flowId, "both", likeConfig.reaction.dislike, createdBy, (err, data) => {
                                if (err) {
                                    console.log("Error ::: while disliking the flowId");
                                    return callback(null, err, err.code);
                                }
                                return callback(null, data, data.code);
                            });
                        }
                    } else if (reactionType === likeConfig.reaction.like && oldStatus !== likeConfig.reaction.like) {
                        if (flowType === likeConfig.flow.vendor) {
                            vendorService.updateLikeDislikeCount(flowId, "both", likeConfig.reaction.like, createdBy, (err, data) => {
                                if (err) {
                                    console.log("Error ::: while liking the flowId");
                                    return callback(null, err, err.code);
                                }
                                return callback(null, data, data.code);
                            });
                        } else if (flowType === likeConfig.flow.dish) {
                            dishesService.updateLikeDislikeCount(flowId, "both", likeConfig.reaction.like, createdBy, (err, data) => {
                                if (err) {
                                    console.log("Error ::: while liking the flowId");
                                    return callback(null, err, err.code);
                                }
                                return callback(null, data, data.code);
                            });
                        }
                    } else {
                        if (reactionType === likeConfig.reaction.dislike) {
                            if (flowType === likeConfig.flow.vendor) {
                                vendorService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.dislike, createdBy, (err, data) => {
                                    if (err) {
                                        console.log("Error ::: while disliking the flowId");
                                        return callback(null, err, err.code);
                                    }
                                    return callback(null, data, data.code);
                                });
                            } else if (flowType === likeConfig.flow.dish) {
                                dishesService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.dislike, createdBy, (err, data) => {
                                    if (err) {
                                        console.log("Error ::: while disliking the flowId");
                                        return callback(null, err, err.code);
                                    }
                                    return callback(null, data, data.code);
                                });
                            }
        
                        } else if (reactionType === likeConfig.reaction.like) {
                            if (flowType === likeConfig.flow.vendor) {
                                vendorService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.like, createdBy, (err, data) => {
                                    if (err) {
                                        console.log("Error ::: while liking the flowId");
                                        return callback(null, err, err.code);
                                    }
                                    return callback(null, data, data.code);
                                });
                            } else if (flowType === likeConfig.flow.dish) {
                                dishesService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.like, createdBy, (err, data) => {
                                    if (err) {
                                        console.log("Error ::: while liking the flowId");
                                        return callback(null, err, err.code);
                                    }
                                    return callback(null, data, data.code);
                                });
                            }
        
                        }
                    }
                }
            } else {
                if (reactionType === likeConfig.reaction.dislike) {
                    if (flowType === likeConfig.flow.vendor) {
                        vendorService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.dislike, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while disliking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    } else if (flowType === likeConfig.flow.dish) {
                        dishesService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.dislike, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while disliking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    }

                } else if (reactionType === likeConfig.reaction.like) {
                    if (flowType === likeConfig.flow.vendor) {
                        vendorService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.like, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while liking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    } else if (flowType === likeConfig.flow.dish) {
                        dishesService.updateLikeDislikeCount(flowId, "single", likeConfig.reaction.like, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while liking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    }

                }
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    deleteLikeDislike: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const flowId = body.flowId;
            const createdBy = body.createdBy;
            const flowType = body.flowType;

            if (!flowId || !flowType || !createdBy || !createdBy.userId || !createdBy.userName) {
                console.log("Missing Info ::: flowIdId: " + flowId + ". createdBy: " + createdBy
                    + ". createdBy.userId: " + createdBy.userId + ". flowType: " + flowType);
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const updateObject = {
                $set: {
                    createdBy: createdBy,
                    flowId: flowId,
                    flowType: flowType,
                    status: likeConfig.status.deleted
                }
            };
            const query = {
                flowId: mongoose.Types.ObjectId(flowId),
                "createdBy.userId": createdBy.userId,
                status: { $ne: likeConfig.status.deleted }
            }

            const result = await Like.findOneAndUpdate(query, updateObject);
            if (result) {
                const oldStatus = result.reactionType;
                if (oldStatus === likeConfig.reaction.dislike) {
                    if (flowType === likeConfig.flow.vendor) {
                        vendorService.updateLikeDislikeCount(flowId, "none", likeConfig.reaction.dislike, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while disliking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    } else if (flowType === likeConfig.flow.dish) {
                        dishesService.updateLikeDislikeCount(flowId, "none", likeConfig.reaction.dislike, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while disliking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    }
                } else if (oldStatus === likeConfig.reaction.like) {
                    if (flowType === likeConfig.flow.vendor) {
                        vendorService.updateLikeDislikeCount(flowId, "none", likeConfig.reaction.like, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while disliking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    } else if (flowType === likeConfig.flow.dish) {
                        dishesService.updateLikeDislikeCount(flowId, "none", likeConfig.reaction.like, createdBy, (err, data) => {
                            if (err) {
                                console.log("Error ::: while disliking the flowId");
                                return callback(null, err, err.code);
                            }
                            return callback(null, data, data.code);
                        });
                    }
                } else {
                    response = new responseMessage.GenericFailureMessage();
                    return callback(null, response, response.code);
                }

            } else {
                response = new responseMessage.ObjectDoesNotExistInDB();
                return callback(null, response, response.code);
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    }
}