const mysql = require('mysql')

const config = {
    host: 'xxxxxx',
    user: 'xxxx',
    password: 'xxxxxx',
    database: 'xxxx'
}

const poolConfig = {
    connectionLimit: 10,
    host: 'xxxxxx',
    user: 'xxxx',
    password: 'xxxxxxxx',
    database: 'xxxxx'
}


const connection = mysql.createConnection(config)
const pool = mysql.createPool(poolConfig)

module.exports = {
    connection,
    pool
}

