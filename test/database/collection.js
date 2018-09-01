const mysql = require('../../src/database/mysql')

mysql.pool.getConnection((err, single) => {
    if (err) {
        console.error(err)
    } else {
        console.log('connect successfully')
        single.release()
        console.log('release ')
    }
})

