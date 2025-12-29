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

/*const express = require("express");
const { signup, login } = require("./people.service");

const peopleRouter = express.Router();

peopleRouter.post("/signup", async (req, res) => {
  handleSignup(req, res);
});

peopleRouter.post("/login", (req, res) => {
  handleLogin(req, res);
});

async function handleSignup(req, res) {
  try {
    const success = await signup(req, res);
    if (success) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.sendStatus(417);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error1" });
  }
}

async function handleLogin(req, res) {
  try {
    const user = await login(req, res);
    if (user) res.send(200);
    else res.sendStatus(403);
  } catch (err) {
    res.sendStatus(500);
  }
}

module.exports = peopleRouter;
*/
