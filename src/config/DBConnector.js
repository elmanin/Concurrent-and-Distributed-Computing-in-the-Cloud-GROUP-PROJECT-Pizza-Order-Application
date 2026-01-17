const mariadb = require("mariadb");

const options = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "pizzeria",
  port: process.env.DB_PORT || 3306,
};

class DBConnector {
  dbconnector = mariadb.createPool(options);
  performQuery(query) {
    this.dbconnector
      .getConnection()
      .then((conn) => {
        conn
          .query(query)
          .then((result) => {
            console.log(result);
            return result;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
async performAsyncQuery(query, params = []) {  // Optional (defaults to empty array) params to allow for prepared statements to be added
    let conn;
    try {
      const conn = await this.dbconnector.getConnection();
      return await conn.query(query, params);    // Optional params to allow for prepared statements to be added
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (conn) conn.end().catch(err => console.error(err));
    }
  }
}

module.exports = DBConnector;
