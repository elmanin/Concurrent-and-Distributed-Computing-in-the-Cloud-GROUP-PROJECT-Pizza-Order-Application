const mariadb = require("mariadb");

const options = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "pizzeria",
  port: process.env.DB_PORT || 3306, //Mine is 3308 but amazon's 3306
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
