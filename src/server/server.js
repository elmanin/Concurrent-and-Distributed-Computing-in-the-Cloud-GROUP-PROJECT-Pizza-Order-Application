const express = require("express");
const apiRouter = require(".");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.get("/healthCheck", (req, res) => res.send("OK"));

module.exports = app;
