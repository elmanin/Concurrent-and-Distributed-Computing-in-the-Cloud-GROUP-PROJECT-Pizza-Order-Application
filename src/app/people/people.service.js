const { createUser, getUserByEmail } = require("./people.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const key = process.env.JWT_KEY || "SuperDuperSecretKey";

async function signup(req, res) {
  if (!req.body) {
    console.log("no body");
    return res.sendStatus(400);
  }
  if (
    req.body.email == undefined ||
    req.body.password == undefined ||
    req.body.name == undefined ||
    req.body.lastname == undefined ||
    req.body.role == undefined
  ) {
    return res.sendStatus(417);
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      lastname: req.body.lastname,
      role: req.body.role,
    };

    await createUser(userData);
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(417);
  }

  try {
    const user = await getUserByEmail(req.body.email);

    if (!user || user.length === 0) {
      return res.sendStatus(404);
    }

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user[0].password
    );

    if (passwordValid) {
      const token = jwt.sign({ email: user[0].email, role: user[0].role }, key);
      return res.json({ token });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { signup, login };
