const mariadb = require("mariadb");

const options = {
  host: "localhost",
  user: "admin",
  password: process.env.DB_PASSWORD || "password",
  database: "pizzeria",
  port: 3308,
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
  async performAsyncQuery(query) {
    let conn;
    try {
      const conn = await this.dbconnector.getConnection(options);
      return await conn.query(query);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (conn) conn.end();
    }
  }
}

module.exports = DBConnector;
