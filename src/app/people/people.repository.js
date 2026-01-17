const DBConnector = require("../../config/DBConnector");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  try {
    const query = `INSERT INTO people(email, password, name, lastname, role) VALUES (:email, :password, :name, :lastname, :role)`;
    await connection.performAsyncQuery(query, {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      lastname: userData.lastname,
      role: userData.role,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getUserByEmail(email) {
  try {
    const connection = new DBConnector();
    const user = await connection.performAsyncQuery(
      "SELECT * FROM people WHERE email = :email",
      { email },
    );

    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { createUser, getUserByEmail };
