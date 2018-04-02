const mysql = require('../database/mysql')
const sqlExp = require('../database/curd')

function createTable(table_name, table_appendix, callback) {
    getSinglePool((err, single) => {
        if(err) {
            callback(err)
            return
        }
        single.query(sqlExp.create[table_name]( table_name + table_appendix),(err, results) => {
            single.release()
            if(err) {
                callback(err)
            } else {
                callback(null, results)
            }
        })
    })
}

function insertData(table_name, table_appendix, data, callback) {
    getSinglePool(( err, single) => {
        if(err) {
            callback(err)
            return
        }
        single.query(sqlExp.insert[table_name](table_name + table_appendix), data, (err, results, fields) => {
            single.release()
            if(err) {
                if(err.errno === 1146) {
                    createTable(table_name, table_appendix, (err) => {
                        if(err) {
                            callback(err)
                        } else {
                            insertData(table_name, table_appendix, data, callback)
                        }
                    })
                } else {
                    callback(err)
                }
            } else {
                callback(null, results, fields)
            }
        })
    })
}

function getSinglePool(callback) {
    mysql.pool.getConnection((err, single) => {
        if(err) {
            console.error(err)
            callback(err)
        } else {
            callback(null, single)
        }
    })
}

module.exports = {
    insertData
}