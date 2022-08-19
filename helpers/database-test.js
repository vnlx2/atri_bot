var mysql = require('mysql');
var dotenv = require('dotenv');

dotenv.config();

const newLocal = `${process.env.DB_DATABASE}`;
let con = mysql.createConnection({
	host: `${process.env.DB_HOST}`,
	user: `${process.env.DB_USERNAME}`,
	password: `${process.env.DB_PASSWORD}`,
	database: newLocal,
});

const query = 'select * from vn_download_link where code=4';
con.query(query, (err, res) => {
    if (err) throw err;

    console.log(res);
});