const express = require("express");
const {
  handleCreateOrder,
  handleGetCustomerOrders,
  handleGetPendingOrders,
  handleGetCookOrders,
  handleDeliverOrder,
  handleGetAllOrders,
} = require("./orders.service");

const ordersRouter = express.Router();

ordersRouter.post("/create", async (req, res) => {
  await handleCreateOrder(req, res);
});

ordersRouter.get("/customer", async (req, res) => {
  await handleGetCustomerOrders(req, res);
});

ordersRouter.get("/pending", async (req, res) => {
  await handleGetPendingOrders(req, res);
});

ordersRouter.get("/cook", async (req, res) => {
  await handleGetCookOrders(req, res);
});

ordersRouter.put("/:id/deliver", async (req, res) => {
  await handleDeliverOrder(req, res);
});

ordersRouter.get("/all", async (req, res) => {
  await handleGetAllOrders(req, res);
});

module.exports = ordersRouter;
