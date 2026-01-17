const express = require("express");
const { signup, login } = require("./people.service");

const peopleRouter = express.Router();

peopleRouter.post("/signup", async (req, res) => {
  await signup(req, res);
});

peopleRouter.post("/login", async (req, res) => {
  await login(req, res);
});

module.exports = peopleRouter;
