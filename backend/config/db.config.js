const { Pool } = require('pg');
require('dotenv').config();

// Prefer DATABASE_URL (same source Prisma uses) to avoid environment mismatches between
// raw pg client and Prisma. Fallback to discrete vars if DATABASE_URL is not set.
const useConnectionString = Boolean(process.env.DATABASE_URL);

const db = useConnectionString
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to PostgreSQL at:', res.rows[0].now);
});

module.exports = db;
