const DBConnector = require("../../config/DBConnector");

async function createCook(cookData) {
  try {
    const connection = new DBConnector();
    const query = `INSERT INTO cooks(cook_email, pizzaplace_id) 
                   VALUES ('${cookData.cook_email}', ${cookData.pizzaplace_id})`;
    await connection.performAsyncQuery(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getCooks() {
  try {
    const connection = new DBConnector();
    const cooks = await connection.performAsyncQuery(`SELECT * FROM cooks`);
    return cooks;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getCookById(id) {
  try {
    const connection = new DBConnector();
    const cook = await connection.performAsyncQuery(
      `SELECT * FROM cooks WHERE id='${id}'`
    );
    return cook;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getCooksByPizzaPlace(pizzaplaceId) {
  try {
    const connection = new DBConnector();
    const cooks = await connection.performAsyncQuery(
      `SELECT * FROM cooks WHERE pizzaplace_id='${pizzaplaceId}'`
    );
    return cooks;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteCook(id) {
  try {
    const connection = new DBConnector();
    await connection.performAsyncQuery(`DELETE FROM cooks WHERE id='${id}'`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getCookAssignment(cookEmail) {
  try {
    const connection = new DBConnector();
    const assignment = await connection.performAsyncQuery(
      `SELECT * FROM cooks WHERE cook_email='${cookEmail}'`
    );
    return assignment;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  createCook,
  getCooks,
  getCookById,
  getCooksByPizzaPlace,
  deleteCook,
  getCookAssignment,
};
