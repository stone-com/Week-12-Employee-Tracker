const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: localhost,
    dialect: 'mysql',
    port: 3306,
    // set query to raw = true to return plain results with queries
    query: { raw: true },
  }
);

module.exports = sequelize;
