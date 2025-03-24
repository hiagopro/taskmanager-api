const mysql = require("mysql");
let connectionServer;
const hostSecret = "database-1.c5umiqak6ieq.us-east-2.rds.amazonaws.com";
const userSecret = "admin";
const passwordSecret = "PwKiTRnhz3xPhCMh3P";
const databaseSecret = "tasks";
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
