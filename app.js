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
app.use(cors());
app.use("/", routerTasks);

module.exports = app;
