const DBConnector = require("../../config/DBConnector");

async function createOrder(orderData) {
  try {
    const connection = new DBConnector();
    const query = `INSERT INTO orders(order_number, customer_email, pizzaplace_id, total_price, status) 
                   VALUES ('${orderData.order_number}', '${orderData.customer_email}', ${orderData.pizzaplace_id}, ${orderData.total_price}, '${orderData.status}')`;
    await connection.performAsyncQuery(query);

    // Insert order items
    for (const item of orderData.items) {
      const itemQuery = `INSERT INTO order_items(order_id, pizza_id, quantity, unit_price, subtotal)
                         VALUES ((SELECT id FROM orders WHERE order_number='${orderData.order_number}'), ${item.pizza_id}, ${item.quantity}, ${item.unit_price}, ${item.subtotal})`;
      await connection.performAsyncQuery(itemQuery);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getOrdersByCustomer(email) {
  try {
    const connection = new DBConnector();
    const orders = await connection.performAsyncQuery(
      `SELECT * FROM orders WHERE customer_email='${email}'`
    );
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getOrdersByPizzaPlace(pizzaplaceId) {
  try {
    const connection = new DBConnector();
    const orders = await connection.performAsyncQuery(
      `SELECT * FROM orders WHERE pizzaplace_id='${pizzaplaceId}' AND status != 'delivered'`
    );
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getOrdersByPizzaPlace(pizzaplace_id) {
  try {
    const connection = new DBConnector();
    const orders = await connection.performAsyncQuery(
      `SELECT * FROM orders WHERE pizzaplace_id='${pizzaplace_id}' AND status IN ('pending', 'preparing')`
    );
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getOrdersByCook(cookEmail) {
  try {
    const connection = new DBConnector();
    const orders = await connection.performAsyncQuery(
      `SELECT * FROM orders WHERE cook_email='${cookEmail}'`
    );
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getOrderById(id) {
  try {
    const connection = new DBConnector();
    const order = await connection.performAsyncQuery(
      `SELECT * FROM orders WHERE id='${id}'`
    );
    return order;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateOrderStatus(orderId, status, cookEmail = null) {
  try {
    const connection = new DBConnector();
    let query = `UPDATE orders SET status='${status}'`;
    if (cookEmail) {
      query += `, cook_email='${cookEmail}'`;
    }
    if (status === "delivered") {
      query += `, delivery_date=NOW()`;
    }
    query += ` WHERE id='${orderId}'`;
    await connection.performAsyncQuery(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllOrders() {
  try {
    const connection = new DBConnector();
    const orders = await connection.performAsyncQuery(`SELECT * FROM orders`);
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createTransaction(transactionData) {
  try {
    const connection = new DBConnector();
    const query = `INSERT INTO transactions(transaction_type, related_order_id, related_pizzaplace_id, user_email, amount) 
                   VALUES ('${transactionData.transaction_type}', ${transactionData.related_order_id}, ${transactionData.related_pizzaplace_id}, '${transactionData.user_email}', ${transactionData.amount})`;
    await connection.performAsyncQuery(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  createOrder,
  getOrdersByCustomer,
  getOrdersByPizzaPlace,
  getOrdersByCook,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  createTransaction,
};
