const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// async function getAllRecords() {
//   const client = await pool.connect();
//   try {
//     const result = await client.query("SELECT * FROM your_table_name");
//     return result.rows;
//   } finally {
//     client.release();
//   }
// }

// module.exports = { getAllRecords };
