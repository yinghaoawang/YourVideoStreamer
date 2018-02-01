var mysql = require('mysql2/promise');
var config = require('./config.json');
var pool = mysql.createPool({
    connectionLimit: 20,
    host: config.mysql.host || process.env.SQL_HOST || 'localhost',
    user: config.mysql.user || process.env.SQL_USER || 'root',
    password: config.mysql.password || process.env.SQL_PASSWORD || '',
    database: config.mysql.database || process.env.SQL_DATABASE || 'yourvideostreamer'
});

module.exports = pool;
