const DBConnector = require("../../config/DBConnector");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  try {
    const connection = new DBConnector();
    const query = `INSERT INTO people(email, password, name, lastname, role) 
                   VALUES ('${userData.email}', '${userData.password}', '${userData.name}', '${userData.lastname}', '${userData.role}')`;
    await connection.performAsyncQuery(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getUserByEmail(email) {
  try {
    const connection = new DBConnector();
    const user = await connection.performAsyncQuery(
      `SELECT * FROM people WHERE email='${email}'`
    );
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { createUser, getUserByEmail };
