const mysql = require("mysql");
let connectionServer;
const hostSecret = process.env.HOST_DATABASE;
const userSecret = process.env.USER;
const passwordSecret = process.env.PASSWORD;
const databaseSecret = process.env.DATABASE;
async function getConnection() {
  if (connectionServer === undefined) {
    connectionServer = mysql.createConnection({
      host: hostSecret,
      user: userSecret,
      password: passwordSecret,
      database: databaseSecret,
    });
    await new Promise((resolve, reject) => {
      connectionServer.connect(function (err) {
        if (err) {
          return reject(err);
        }
        resolve(connectionServer);
        console.log("sucess");
      });
    });
  }

  return connectionServer;
}

module.exports = getConnection;
