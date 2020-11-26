let postgres = require('postgres');
let config = require('./config');
const sql = postgres( config.database );

module.exports = sql;