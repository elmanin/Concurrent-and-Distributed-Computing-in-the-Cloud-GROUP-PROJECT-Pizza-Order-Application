const express = require("express");
const {
  handleCreateCook,
  handleGetCooks,
  handleGetCookById,
  handleGetCooksByPizzaPlace,
  handleDeleteCook,
} = require("./cooks.service");

const cooksRouter = express.Router();

cooksRouter.post("/create", async (req, res) => {
  await handleCreateCook(req, res);
});

cooksRouter.get("/", async (req, res) => {
  await handleGetCooks(req, res);
});

cooksRouter.get("/:id", async (req, res) => {
  await handleGetCookById(req, res);
});

cooksRouter.get("/pizzaplace/:pizzaplaceId", async (req, res) => {
  await handleGetCooksByPizzaPlace(req, res);
});

cooksRouter.delete("/:id", async (req, res) => {
  await handleDeleteCook(req, res);
});

module.exports = cooksRouter;
