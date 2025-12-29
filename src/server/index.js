const express = require("express");
const peopleRouter = require("../app/people/people.controller");
const pizzasPlacesRouter = require("../app/pizzaPlaces/pizzasPlaces.controller");
const pizzasRouter = require("../app/pizzas/pizzas.controller");
const ordersRouter = require("../app/orders/orders.controller");
const cooksRouter = require("../app/cooks/cooks.controller");

const apiRouter = express.Router();

apiRouter.use("/people", peopleRouter);
apiRouter.use("/pizzaPlaces", pizzasPlacesRouter);
apiRouter.use("/pizzas", pizzasRouter);
apiRouter.use("/cooks", cooksRouter);
apiRouter.use("/orders", ordersRouter);

module.exports = apiRouter;
