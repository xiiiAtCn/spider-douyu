const mysql = require('mysql')

const config = {
    host: '180.76.150.252',
    user: 'douyu',
    password: 'Douyu@2453',
    database: 'douyu'
}

const poolConfig = {
    connectionLimit: 10,
    host: '180.76.150.252',
    user: 'douyu',
    password: 'Douyu@2453',
    database: 'douyu',
    charset: 'UTF8_GENERAL_CI'
}


const connection = mysql.createConnection(config)
const pool = mysql.createPool(poolConfig)

module.exports = {
    connection,
    pool
}

