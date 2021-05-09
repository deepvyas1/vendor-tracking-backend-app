"use strict";

const express = require("express");
const dishesRouter = express.Router();
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

dishesRouter.get("/vendor/all", (req, res) => {
    dishesController.getAllVendorDishes(req, res);
});


module.exports = {
    dishesRouter: dishesRouter
}