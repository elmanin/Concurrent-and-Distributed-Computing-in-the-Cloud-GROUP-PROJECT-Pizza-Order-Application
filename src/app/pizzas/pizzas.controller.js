const express = require('express');
const { handleCreatePizza, handleGetPizzas, handleDeletePizza } = require('./pizzas.service');

const pizzasRouter = express.Router();

pizzasRouter.post('/create', async (req, res) => {
  await handleCreatePizza(req, res);
});

pizzasRouter.get('/', async (req, res) => {
  await handleGetPizzas(req, res);
});

pizzasRouter.delete('/:id', async (req, res) => {
  await handleDeletePizza(req, res);
});

module.exports = pizzasRouter;
