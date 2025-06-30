-- Drop existing table if it exists
DROP TABLE IF EXISTS users;

-- Create users table with correct schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES 
    ('Max Mustermann', 'max@example.com'),
    ('Anna Schmidt', 'anna@example.com'),
    ('Tom Weber', 'tom@example.com'),
    ('Lisa Müller', 'lisa@example.com'),
    ('Paul Fischer', 'paul@example.com'),
    ('Sarah Wagner', 'sarah@example.com'),
    ('Michael Schulz', 'michael@example.com'),
    ('Julia Becker', 'julia@example.com');

-- Verify the data
SELECT * FROM users ORDER BY id; 