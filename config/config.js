const fs = require('fs');
require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    username: 'wucuzrzbwggefn',
    password: '423d23c03103c5168f4b29287854e2c7d85c72da2c16c90db5035a986e5d9f35',
    database: 'df98t0ejp7kfjm',
    host: 'ec2-18-234-17-166.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    }
};