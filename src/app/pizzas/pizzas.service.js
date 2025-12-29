const {
  createPizza,
  getPizzas,
  getPizzaById,
  deletePizza,
} = require("./pizzas.repository");
const jwt = require("jsonwebtoken");

const key = process.env.JWT_KEY || "SuperDuperSecretKey";

async function handleCreatePizza(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.sendStatus(417);
    }

    const pizzaData = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    await createPizza(pizzaData);
    return res
      .status(201)
      .json({ message: "Pizza menu item created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetPizzas(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, key);

    const pizzas = await getPizzas();
    return res.json(pizzas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleDeletePizza(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    if (!req.params.id) return res.sendStatus(417);

    await deletePizza(req.params.id);
    return res.json({ message: "Pizza menu item deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { handleCreatePizza, handleGetPizzas, handleDeletePizza };
