const express = require("express");
const app = express();
const cors = require("cors");
const routerTasks=require("./routes/tasks.js")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
const whitelist = ["http://localhost:3000", "http://localhost:3000/", undefined];

app.use(
    cors({
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          return callback(null, true);
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
