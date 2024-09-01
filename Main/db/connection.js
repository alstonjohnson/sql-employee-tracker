
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'employee_database',
    port: 5432
});

module.exports = pool; 