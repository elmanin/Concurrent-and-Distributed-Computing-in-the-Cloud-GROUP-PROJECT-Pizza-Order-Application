DROP DATABASE IF EXISTS pizzeria;
CREATE DATABASE IF NOT EXISTS pizzeria;

USE pizzeria;

-- ============================================
-- TABLE: people
-- Stores all users (managers, cooks, customers)
-- ============================================
CREATE TABLE IF NOT EXISTS people (
    email VARCHAR(120) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    role ENUM('manager', 'cook', 'customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'),
    CONSTRAINT chk_password_length CHECK (CHAR_LENGTH(password) >= 8)
);

-- Index for faster role-based queries
CREATE INDEX idx_people_role ON people(role);

-- ============================================
-- TABLE: pizzaPlaces
-- Stores information about pizza locations
-- ============================================
CREATE TABLE IF NOT EXISTS pizzaPlaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    manager_email VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pizzaplace_manager FOREIGN KEY (manager_email) 
        REFERENCES people(email) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_phone_format CHECK (phone REGEXP '^[0-9+\\-\\s()]+$' OR phone IS NULL),
    
    -- Index for manager lookups
    INDEX idx_manager_email (manager_email)
);

-- ============================================
-- TABLE: cooks
-- Junction table linking cooks to pizza places
-- ============================================
CREATE TABLE IF NOT EXISTS cooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cook_email VARCHAR(120) NOT NULL,
    pizzaplace_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cook_email FOREIGN KEY (cook_email) 
        REFERENCES people(email) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_cook_pizzaplace FOREIGN KEY (pizzaplace_id) 
        REFERENCES pizzaPlaces(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Prevent duplicate assignments
    CONSTRAINT uq_cook_pizzaplace UNIQUE (cook_email, pizzaplace_id),
    
    -- Indexes for faster lookups
    INDEX idx_cook_email (cook_email),
    INDEX idx_pizzaplace_id (pizzaplace_id)
);

-- ============================================
-- TABLE: pizzas
-- Menu items (pizzas, drinks, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_category_valid CHECK (category IN ('pizza', 'drink', 'appetizer', 'dessert', 'side')),
    
    -- Index for category filtering
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);

-- ============================================
-- TABLE: orders
-- Customer orders at pizza places
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_email VARCHAR(120) NOT NULL,
    pizzaplace_id INT NOT NULL,
    cook_email VARCHAR(120),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'in_progress', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_email) 
        REFERENCES people(email) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_order_pizzaplace FOREIGN KEY (pizzaplace_id) 
        REFERENCES pizzaPlaces(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_order_cook FOREIGN KEY (cook_email) 
        REFERENCES people(email) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_total_price_positive CHECK (total_price >= 0),
    CONSTRAINT chk_delivery_after_order CHECK (delivery_date IS NULL OR delivery_date >= order_date),
    
    -- Indexes for common queries
    INDEX idx_customer_email (customer_email),
    INDEX idx_pizzaplace_id (pizzaplace_id),
    INDEX idx_cook_email (cook_email),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- ============================================
-- TABLE: order_items
-- Line items for each order
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    pizza_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_orderitem_pizza FOREIGN KEY (pizza_id) 
        REFERENCES pizzas(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_unit_price_positive CHECK (unit_price > 0),
    CONSTRAINT chk_subtotal_positive CHECK (subtotal >= 0),
    CONSTRAINT chk_subtotal_calculation CHECK (subtotal = quantity * unit_price),
    
    -- Indexes for order lookups
    INDEX idx_order_id (order_id),
    INDEX idx_pizza_id (pizza_id)
);

-- ============================================
-- TABLE: transactions
-- Financial and activity transaction log
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_type ENUM('order_placed', 'order_delivered', 'order_cancelled', 'refund', 'payment') NOT NULL,
    related_order_id INT,
    related_pizzaplace_id INT NOT NULL,
    user_email VARCHAR(120) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    CONSTRAINT fk_transaction_order FOREIGN KEY (related_order_id) 
        REFERENCES orders(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_transaction_pizzaplace FOREIGN KEY (related_pizzaplace_id) 
        REFERENCES pizzaPlaces(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_transaction_user FOREIGN KEY (user_email) 
        REFERENCES people(email) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_amount_not_zero CHECK (amount != 0),
    
    -- Indexes for transaction queries
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_related_order_id (related_order_id),
    INDEX idx_related_pizzaplace_id (related_pizzaplace_id),
    INDEX idx_user_email (user_email),
    INDEX idx_transaction_date (transaction_date)
);

-- ============================================
-- CREATE DATABASE USER
-- ============================================
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON pizzeria.* TO 'admin'@'%';
FLUSH PRIVILEGES;

-- ============================================
-- SAMPLE DATA --passwords won't be hashed, don't recommend using
-- ============================================
INSERT INTO people (email, password, name, lastname, role) VALUES
('manager@pizzeria.com', 'hashed_password_1', 'Juan', 'García', 'manager'),
('cook1@pizzeria.com', 'hashed_password_2', 'Marco', 'Rossi', 'cook'),
('customer1@email.com', 'hashed_password_3', 'Carlos', 'López', 'customer');

INSERT INTO pizzaPlaces (name, address, city, phone, manager_email) VALUES
('Pizzeria Central', 'Calle Mayor 45', 'Madrid', '+34-912-345-678', 'manager@pizzeria.com');

INSERT INTO cooks (cook_email, pizzaplace_id) VALUES
('cook1@pizzeria.com', 1);

INSERT INTO pizzas (name, price, category) VALUES
('4quesos', 12.50, 'pizza'),
('Pepperoni', 14.00, 'pizza'),
('Coca-Cola', 2.50, 'drink');

-- ============================================
-- TESTING QUERIES
-- ============================================
SELECT * FROM people;
SELECT * FROM pizzaPlaces;
SELECT * FROM cooks;
SELECT * FROM pizzas;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM transactions;
