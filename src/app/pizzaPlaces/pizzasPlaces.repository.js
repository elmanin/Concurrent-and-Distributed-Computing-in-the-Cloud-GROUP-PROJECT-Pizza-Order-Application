const DBConnector = require("../../config/DBConnector");

async function createPizzaPlace(pizzaData) {
  try {
    const connection = new DBConnector();
    const query = `INSERT INTO pizzaPlaces(name, address, city, phone, manager_email) 
                   VALUES ('${pizzaData.name}', '${pizzaData.address}', '${pizzaData.city}', '${pizzaData.phone}', '${pizzaData.manager_email}')`;
    await connection.performAsyncQuery(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getPizzaPlaces() {
  try {
    const connection = new DBConnector();
    const pizzaPlaces = await connection.performAsyncQuery(
      `SELECT * FROM pizzaPlaces`
    );
    return pizzaPlaces;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getPizzaPlaceById(id) {
  try {
    const connection = new DBConnector();
    const pizzaPlace = await connection.performAsyncQuery(
      `SELECT * FROM pizzaPlaces WHERE id='${id}'`
    );
    return pizzaPlace;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deletePizzaPlace(pizzaId) {
  try {
    const connection = new DBConnector();
    await connection.performAsyncQuery(
      `DELETE FROM pizzaPlaces WHERE id='${pizzaId}'`
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  createPizzaPlace,
  getPizzaPlaces,
  getPizzaPlaceById,
  deletePizzaPlace,
};
