const mysql = require('../database/mysql')

function getSinglePool(callback) {
    mysql.pool.getConnection((err, single) => {
        if(err) {
            console.error(err)
            callback(err)
        } else {
            callback(null, single)
            single.release()
        }
    })
}