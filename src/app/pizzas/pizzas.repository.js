const DBConnector = require("../../config/DBConnector");

async function createPizza(pizzaData) {
  try {
    const connection = new DBConnector();
    const query = `INSERT INTO pizzas(name, price, category) 
                   VALUES ('${pizzaData.name}', '${pizzaData.price}', '${pizzaData.category}')`;
    await connection.performAsyncQuery(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getPizzas() {
  try {
    const connection = new DBConnector();
    const pizzas = await connection.performAsyncQuery(`SELECT * FROM pizzas`);
    return pizzas;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getPizzaById(id) {
  try {
    const connection = new DBConnector();
    const pizza = await connection.performAsyncQuery(
      `SELECT * FROM pizzas WHERE id='${id}'`
    );
    return pizza;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deletePizza(pizzaId) {
  try {
    const connection = new DBConnector();
    await connection.performAsyncQuery(
      `DELETE FROM pizzas WHERE id='${pizzaId}'`
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { createPizza, getPizzas, getPizzaById, deletePizza };
