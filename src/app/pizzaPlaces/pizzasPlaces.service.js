const {
  createPizzaPlace,
  getPizzaPlaces,
  getPizzaPlaceById,
  deletePizzaPlace,
} = require("./pizzasPlaces.repository");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const key = process.env.JWT_KEY || "SuperDuperSecretKey";

async function handleCreatePizzaPlace(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    if (
      !req.body.name ||
      !req.body.address ||
      !req.body.city ||
      !req.body.manager_email
    ) {
      return res.sendStatus(417);
    }

    const pizzaPlaceData = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone || null,
      email: req.body.email || null,
      manager_email: req.body.manager_email,
    };

    await createPizzaPlace(pizzaPlaceData);
    return res
      .status(201)
      .json({ message: "Pizza place created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetPizzaPlaces(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, key);

    const pizzaPlaces = await getPizzaPlaces();
    return res.json(pizzaPlaces);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetPizzaPlaceById(req, res) {
  try {
    const token = req.getAuthorization?.().split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, key); // Auth check (role not restricted per requirements)
    
    if (!req.params.id) return res.sendStatus(417);
    const pizzaPlace = await getPizzaPlaceById(req.params.id);
    
    if (!pizzaPlace.length) return res.status(404).json({ error: 'Pizza place not found' });
    return res.json(pizzaPlace[0]); // Return first (single) result
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleDeletePizzaPlace(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    if (!req.params.id) return res.sendStatus(417);

    await deletePizzaPlace(req.params.id);
    return res.json({ message: "Pizza place deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleCreatePizzaPlace,
  handleGetPizzaPlaces,
  handleGetPizzaPlaceById,
  handleDeletePizzaPlace,
};
