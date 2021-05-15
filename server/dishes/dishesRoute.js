"use strict";

const express = require("express");
const dishesRouter = express.Router();
const dishFeedRouter = express.Router();
const dishesController = require("./dishesController");

dishesRouter.post("/create/new", (req, res) => {
    dishesController.insertNewDish(req, res);
});

dishesRouter.post("/update", (req, res) => {
    dishesController.updateDish(req, res);
});

dishesRouter.post("/update/availability", (req, res) => {
    dishesController.updateDishAvailability(req, res);
});

dishesRouter.post("/delete", (req, res) => {
    dishesController.deleteDish(req, res);
});

dishFeedRouter.get("/vendor/all", (req, res) => {
    dishesController.getAllVendorDishes(req, res);
});

dishFeedRouter.get("/detail/get",(req, res) => {
    dishesController.getDishDetail(req, res);
});

dishFeedRouter.get("/details/get/all", (req, res) => {
    dishesController.getAllDishes(req, res);
})


module.exports = {
    dishesRouter: dishesRouter,
    dishFeedRouter: dishFeedRouter
}