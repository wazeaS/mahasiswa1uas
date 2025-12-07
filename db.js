const { Pool } = require("pg");

// Pool koneksi ke Neon DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // wajib untuk Neon/Vercel
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
