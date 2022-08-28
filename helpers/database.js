/* eslint-disable indent */
const mysql = require('mysql');
const dotenv = require('dotenv');
const util = require('util');
const logger = require('../services/logger_service');

dotenv.config();

let pool = '';

try {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    pool.query = util.promisify(pool.query);
}
catch (err) {
    console.error(err);
    logger.error(err);
}

module.exports = pool;