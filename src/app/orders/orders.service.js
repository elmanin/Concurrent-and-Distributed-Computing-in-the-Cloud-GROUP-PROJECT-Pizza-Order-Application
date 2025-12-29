const {
  createOrder,
  getOrdersByCustomer,
  getOrdersByPizzaPlace,
  getOrdersByCook,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  createTransaction,
} = require("./orders.repository");
const { getPizzaById } = require("../pizzas/pizzas.repository");
const { getCooksByPizzaPlace } = require("../cooks/cooks.repository");
const { getCookAssignment } = require("../cooks/cooks.repository");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const key = process.env.JWT_KEY || "SuperDuperSecretKey";

async function handleCreateOrder(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "customer") return res.sendStatus(403);

    if (
      !req.body.pizzaplace_id ||
      !req.body.items ||
      req.body.items.length === 0
    ) {
      return res
        .status(417)
        .json({ error: "Missing required fields (pizzaplace_id, items)" });
    }

    // Calculate total price
    let totalPrice = 0;
    const items = [];

    for (const item of req.body.items) {
      const pizza = await getPizzaById(item.pizza_id);
      if (!pizza || pizza.length === 0) {
        return res
          .status(404)
          .json({ error: `Pizza ${item.pizza_id} not found` });
      }

      const subtotal = pizza[0].price * item.quantity;
      totalPrice += subtotal;

      items.push({
        pizza_id: item.pizza_id,
        quantity: item.quantity,
        unit_price: pizza[0].price,
        subtotal: subtotal,
      });
    }

    const orderData = {
      order_number: `ORD-${Date.now()}-${uuid().substring(0, 8)}`,
      customer_email: jwtPayload.email,
      pizzaplace_id: req.body.pizzaplace_id,
      total_price: totalPrice,
      status: "pending",
      items: items,
    };

    await createOrder(orderData);

    // Log transaction
    await createTransaction({
      transaction_type: "order_placed",
      related_order_id: null,
      related_pizzaplace_id: req.body.pizzaplace_id,
      user_email: jwtPayload.email,
      amount: totalPrice,
    });

    return res.status(201).json({
      message: "Order created successfully",
      order_number: orderData.order_number,
      total: totalPrice,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetCustomerOrders(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "customer") return res.sendStatus(403);

    const orders = await getOrdersByCustomer(jwtPayload.email);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetPendingOrders(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "cook") return res.sendStatus(403);
    const cookAssignment = await getCookAssignment(jwtPayload.email);
    if (!cookAssignment || cookAssignment.length === 0) {
      return res
        .status(404)
        .json({ error: "Cook not assigned to any pizza place" });
    }

    const orders = await getOrdersByPizzaPlace(cookAssignment[0].pizzaplace_id);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetCookOrders(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "cook") return res.sendStatus(403);

    const orders = await getOrdersByCook(jwtPayload.email);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleDeliverOrder(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "cook") return res.sendStatus(403);

    if (!req.params.id) return res.sendStatus(417);

    const order = await getOrderById(req.params.id);
    if (!order || order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Pass cook's email to updateOrderStatus
    await updateOrderStatus(req.params.id, "delivered", jwtPayload.email);

    // Log transaction
    await createTransaction({
      transaction_type: "order_delivered",
      related_order_id: req.params.id,
      related_pizzaplace_id: order[0].pizzaplace_id,
      user_email: jwtPayload.email,
      amount: order[0].total_price,
    });

    return res.json({ message: "Order marked as delivered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAllOrders(req, res) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const jwtPayload = jwt.verify(token, key);
    if (jwtPayload.role !== "manager") return res.sendStatus(403);

    const orders = await getAllOrders();
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleCreateOrder,
  handleGetCustomerOrders,
  handleGetPendingOrders,
  handleGetCookOrders,
  handleDeliverOrder,
  handleGetAllOrders,
};
