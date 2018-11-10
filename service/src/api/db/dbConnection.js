import mysql from 'mysql';
import util from 'util';
import { TEST_DB_NAME } from '../constants';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.DB_HOST_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? TEST_DB_NAME : process.env.DB_NAME
});

/**
 * This is used for the first time this module is required
 * to test database connection.
 */
pool.getConnection((err, connection) => {
  if (err) {
    switch (err.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        console.error('Database connection was closed.');
        break;
      case 'ER_CON_COUNT_ERROR':
        console.error('Database has too many connections.');
        break;
      case 'ECONNREFUSED':
        console.error('Database connection was refused .');
        break;
    }
  };

  if (connection) connection.release();
  return;
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

export default pool;
