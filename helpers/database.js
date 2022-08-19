/* eslint-disable indent */
const mysql = require('mysql');
const dotenv = require('dotenv');
const util = require('util');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

pool.query = util.promisify(pool.query);

module.exports = pool;