const express = require('express');
const { handleCreatePizzaPlace, handleGetPizzaPlaces,handleGetPizzaPlaceById, handleDeletePizzaPlace } = require('./pizzasPlaces.service');

const pizzasPlacesRouter = express.Router();

pizzasPlacesRouter.post('/create', async (req, res) => {
  await handleCreatePizzaPlace(req, res);
});

pizzasPlacesRouter.get('/', async (req, res) => {
  await handleGetPizzaPlaces(req, res);
});

pizzasPlacesRouter.get('/:id', async (req, res) => {
  await handleGetPizzaPlaceById(req, res);
});

pizzasPlacesRouter.delete('/:id', async (req, res) => {
  await handleDeletePizzaPlace(req, res);
});

module.exports = pizzasPlacesRouter;
