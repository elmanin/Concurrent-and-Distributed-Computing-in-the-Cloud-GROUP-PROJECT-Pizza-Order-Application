CREATE DATABASE IF NOT EXISTS pizzeria;
USE pizzeria;

CREATE TABLE IF NOT EXISTS people (
    email VARCHAR(120) PRIMARY KEY,
    password VARCHAR(255),
    name VARCHAR(50),
    lastname VARCHAR(100),
    role VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS pizzaPlaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    phone VARCHAR(20),
    manager_email VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS cooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cook_email VARCHAR(120),
    pizzaplace_id INT
);

CREATE TABLE IF NOT EXISTS pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),
    category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50),
    customer_email VARCHAR(120),
    pizzaplace_id INT,
    cook_email VARCHAR(120),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL,
    total_price DECIMAL(10, 2),
    status VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    pizza_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    subtotal DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_type VARCHAR(50),
    related_order_id INT,
    related_pizzaplace_id INT,
    user_email VARCHAR(120),
    amount DECIMAL(10, 2),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON pizzeria.* TO 'admin'@'%';
FLUSH PRIVILEGES;

INSERT INTO people (email, password, name, lastname, role) VALUES
('manager@pizzeria.com', 'hashed_password_1', 'Juan', 'García', 'manager'),
('cook1@pizzeria.com', 'hashed_password_2', 'Marco', 'Rossi', 'cook'),
('customer1@email.com', 'hashed_password_3', 'Carlos', 'López', 'customer');

INSERT INTO pizzaPlaces (name, address, city, manager_email) VALUES
('Pizzeria Central', 'Calle Mayor 45', 'Madrid', 'manager@pizzeria.com');

INSERT INTO cooks (cook_email, pizzaplace_id) VALUES
('cook1@pizzeria.com', 1);

INSERT INTO pizzas (name, price, category) VALUES
('Margherita', 12.50, 'pizza'),
('Pepperoni', 14.00, 'pizza'),
('Coca-Cola', 2.50, 'drink');

#testing
SELECT * FROM people;
SELECT * FROM pizzaPlaces;
SELECT * FROM cooks;
SELECT * FROM pizzas;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM transactions;
