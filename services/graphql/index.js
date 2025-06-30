const { ApolloServer, gql } = require('apollo-server');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const typeDefs = gql`
  type Profile {
    avatar: String
    bio: String
  }

  type User {
    id: ID!
    name: String
    email: String
    createdAt: String
    profile: Profile
    matchScore: Int
  }

  type Query {
    users: [User]
    user(id: ID!): User
    searchUsers(term: String!): [User]
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
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`GraphQL ready at ${url}`);
});