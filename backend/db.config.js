import mysql from "mysql2/promise";

// Get database connection parameters from environment variables
// with fallback to default values for local development
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ShelfX",
};

// Create and export the database connection pool
const db = mysql.createPool(dbConfig);

export default db;