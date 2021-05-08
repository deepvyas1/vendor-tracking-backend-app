"use strict";

const userRoute = require("./server/user/userRoute").userRouter;
const vendorRoute = require("./server/vendor/vendorRoute").vendorRouter;
const dishesRoute = require("./server/dishes/dishesRoute").dishesRouter;
const likeRoute = require("./server/like/likeRoute").likeRouter;
const imageRoute = require("./server/images/imageRoute").imageRouter;

const isJWTAuthenticatedMW = require("./utils/middlewares").isJWTAuthenticatedMW;
const isValidImage = require("./utils/middlewares").isValidImage;

module.exports = function(app) {

    app.use("/v1/api/user/account", [isJWTAuthenticatedMW], userRoute);

    app.use("/v1/api/user/vendor", [isJWTAuthenticatedMW], vendorRoute);

    app.use("/v1/api/user/dish", [isJWTAuthenticatedMW], dishesRoute);

    app.use("/v1/api/user/reviews", [isJWTAuthenticatedMW], likeRoute);

    app.use("/v1/api/user/image/single", [isJWTAuthenticatedMW, isValidImage], imageRoute);

}