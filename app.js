require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();
const cors = require("cors");
const routerTasks = require("./routes/tasks.js");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const frontUrl = process.env.FRONT_URL;
const whitelist = [frontUrl];
console.debug(whitelist);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      console.debug({ origin, whitelist });
      if (!origin) {
        return callback(null, true); // Permite requisições same-origin
      }

      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true); // Permite a origem se estiver na whitelist
      }

      const errorMessage = `The CORS policy for this site does not allow access from '${origin}'. Allowed origins: [${whitelist
        .map((acceptedOrigin) => `'${acceptedOrigin}'`)
        .join(", ")}]`;

      console.warn(errorMessage);
      return callback(new Error(errorMessage), false);
    },
  })
);
app.use("/", routerTasks);

module.exports = app;
