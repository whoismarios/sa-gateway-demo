const { ApolloServer, gql } = require('apollo-server');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const typeDefs = gql`
  type Profile {
    avatar: String
    bio: String
  }

  type Order {
    id: ID!
    product: String!
    quantity: Int!
    createdAt: String
    user: User
  }

  type User {
    id: ID!
    name: String
    email: String
    createdAt: String
    profile: Profile
    matchScore: Int
    orders: [Order]
  }

  type Query {
    users: [User]
    user(id: ID!): User
    searchUsers(term: String!): [User]
    orders: [Order]
    ordersByUser(userId: ID!): [Order]
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
      
      await pool.query(`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`);
      
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
      
      const res = await pool.query('SELECT id, name, email, created_at as "createdAt" FROM users ORDER BY id');
      return res.rows.map(user => ({
        ...user,
        matchScore: null,
        profile: {
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
          bio: `Software Developer bei ${user.name.split(' ')[0]} GmbH`
        }
      }));
    },
    
    user: async (_, { id }) => {
      const res = await pool.query('SELECT id, name, email, created_at as "createdAt" FROM users WHERE id = $1', [id]);
      if (res.rows.length === 0) return null;
      
      const user = res.rows[0];
      return {
        ...user,
        matchScore: null,
        profile: {
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
          bio: `Software Developer bei ${user.name.split(' ')[0]} GmbH`
        }
      };
    },
    
    searchUsers: async (_, { term }) => {
      const res = await pool.query(
        'SELECT id, name, email, created_at as "createdAt" FROM users WHERE name ILIKE $1 OR email ILIKE $1',
        [`%${term}%`]
      );
      
      return res.rows.map(user => ({
        ...user,
        matchScore: Math.floor(Math.random() * 100) + 1,
        profile: {
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
          bio: `Software Developer bei ${user.name.split(' ')[0]} GmbH`
        }
      }));
    },
    
    orders: async () => {
      const res = await pool.query(`
        SELECT o.id, o.product, o.quantity, o.created_at as "createdAt", 
               u.id as "userId", u.name as "userName", u.email as "userEmail"
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.id
      `);
      
      return res.rows.map(order => ({
        ...order,
        user: {
          id: order.userId,
          name: order.userName,
          email: order.userEmail
        }
      }));
    },
    
    ordersByUser: async (_, { userId }) => {
      const res = await pool.query(`
        SELECT o.id, o.product, o.quantity, o.created_at as "createdAt"
        FROM orders o 
        WHERE o.user_id = $1
        ORDER BY o.id
      `, [userId]);
      
      return res.rows;
    }
  },
  
  User: {
    orders: async (parent) => {
      const res = await pool.query(`
        SELECT id, product, quantity, created_at as "createdAt"
        FROM orders 
        WHERE user_id = $1
        ORDER BY id
      `, [parent.id]);
      
      return res.rows;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`GraphQL ready at ${url}`);
});