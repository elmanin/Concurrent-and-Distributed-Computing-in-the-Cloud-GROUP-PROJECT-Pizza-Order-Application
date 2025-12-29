const {
  createCook,
  getCooks,
  getCookById,
  getCooksByPizzaPlace,
  deleteCook,
} = require("./cooks.repository");
const jwt = require("jsonwebtoken");

const key = process.env.JWT_KEY || "SuperDuperSecretKey";

async function handleCreateCook(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    if (!req.body.cook_email || !req.body.pizzaplace_id) {
      return res
        .status(417)
        .json({ error: "Missing required fields (cook_email, pizzaplace_id)" });
    }

    const cookData = {
      cook_email: req.body.cook_email,
      pizzaplace_id: req.body.pizzaplace_id,
    };

    await createCook(cookData);
    return res
      .status(201)
      .json({ message: "Cook assigned to pizza place successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetCooks(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, key);

    const cooks = await getCooks();
    return res.json(cooks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetCookById(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, key);

    if (!req.params.id) return res.sendStatus(417);

    const cook = await getCookById(req.params.id);
    return res.json(cook);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetCooksByPizzaPlace(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, key);

    if (!req.params.pizzaplaceId) return res.sendStatus(417);

    const cooks = await getCooksByPizzaPlace(req.params.pizzaplaceId);
    return res.json(cooks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleDeleteCook(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    if (!req.params.id) return res.sendStatus(417);

    await deleteCook(req.params.id);
    return res.json({ message: "Cook deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleCreateCook,
  handleGetCooks,
  handleGetCookById,
  handleGetCooksByPizzaPlace,
  handleDeleteCook,
};
