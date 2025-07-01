const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/api/hello', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    
    // Insert sample data if table is empty
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(countResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (name, email) VALUES 
        ('Max Mustermann', 'max@example.com'),
        ('Anna Schmidt', 'anna@example.com'),
        ('Tom Weber', 'tom@example.com'),
        ('Lisa Müller', 'lisa@example.com'),
        ('Paul Fischer', 'paul@example.com'),
        ('Sarah Wagner', 'sarah@example.com'),
        ('Michael Schulz', 'michael@example.com'),
        ('Julia Becker', 'julia@example.com')
      `);
    }
    
    // Insert sample orders if table is empty
    const orderCountResult = await pool.query('SELECT COUNT(*) FROM orders');
    if (parseInt(orderCountResult.rows[0].count) === 0) {
      await pool.query(`
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
        (8, 'Speakers', 2)
      `);
    }
    
    const usersResult = await pool.query('SELECT id, name, email, created_at as "createdAt" FROM users ORDER BY id LIMIT 5');
    const ordersResult = await pool.query(`
      SELECT o.id, o.product, o.quantity, o.created_at as "createdAt", 
             u.name as "userName", u.email as "userEmail"
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.id LIMIT 10
    `);
    
    res.json({ 
      msg: 'Hello from REST', 
      users: usersResult.rows,
      orders: ordersResult.rows,
      totalUsers: usersResult.rows.length,
      totalOrders: ordersResult.rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// New endpoint for orders by user ID
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT o.id, o.product, o.quantity, o.created_at as "createdAt"
      FROM orders o 
      WHERE o.user_id = $1
      ORDER BY o.id
    `, [userId]);
    
    res.json({ 
      userId: parseInt(userId),
      orders: result.rows,
      totalOrders: result.rows.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.listen(port, () => console.log(`REST API listening on port ${port}`));