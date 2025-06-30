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
    
    // Insert sample data if table is empty
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(countResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (name, email) VALUES 
        ('Max Mustermann', 'max@example.com'),
        ('Anna Schmidt', 'anna@example.com'),
        ('Tom Weber', 'tom@example.com'),
        ('Lisa Müller', 'lisa@example.com'),
        ('Paul Fischer', 'paul@example.com')
      `);
    }
    
    const result = await pool.query('SELECT id, name, email, created_at as "createdAt" FROM users ORDER BY id LIMIT 5');
    res.json({ 
      msg: 'Hello from REST', 
      users: result.rows,
      totalUsers: result.rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.listen(port, () => console.log(`REST API listening on port ${port}`));