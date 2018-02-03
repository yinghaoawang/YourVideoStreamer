var mysql = require('mysql2/promise');
var config = require('./config');
var pool = mysql.createPool({
    connectionLimit: 20,
    host: config.mysql.host || process.env.MYSQL_HOST || 'localhost',
    user: config.mysql.user || process.env.MYSQL_USER || 'root',
    password: config.mysql.password || process.env.MYSQL_PASSWORD || '',
    database: config.mysql.database || process.env.MYSQL_DATABASE || 'yourvideostreamer'
});

module.exports = pool;
