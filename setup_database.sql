-- Drop existing table if it exists
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;

-- Create users table with correct schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table for gRPC service
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data for users
INSERT INTO users (name, email) VALUES 
    ('Max Mustermann', 'max@example.com'),
    ('Anna Schmidt', 'anna@example.com'),
    ('Tom Weber', 'tom@example.com'),
    ('Lisa Müller', 'lisa@example.com'),
    ('Paul Fischer', 'paul@example.com'),
    ('Sarah Wagner', 'sarah@example.com'),
    ('Michael Schulz', 'michael@example.com'),
    ('Julia Becker', 'julia@example.com');

-- Insert sample data for orders
INSERT INTO orders (user_id, product, quantity) VALUES 
    (1, 'Laptop', 1),
    (1, 'Mouse', 2),
    (2, 'Keyboard', 1),
    (2, 'Monitor', 1),
    (3, 'Headphones', 1),
    (4, 'USB Cable', 5),
    (5, 'Webcam', 1),
    (6, 'Tablet', 1),
    (7, 'Printer', 1),
    (8, 'Speakers', 2);

-- Verify the data
SELECT * FROM users ORDER BY id;
SELECT * FROM orders ORDER BY id; 