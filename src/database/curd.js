const mysql = require('./mysql')


module.exports = {
    insertGame,
    insertAnchor,
    selectAllGame,
    selectAnchorBySubType
}

let Pool = {
    getPool() {
        return new Promise(function(resolve, reject) {
            mysql.pool.getConnection((err, single) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else {
                    resolve(single)
                }
            })
        })
    }
}

function insertGame (gameList, callback, ...params) {
    let array = gameList.map(e => {
        return [e.game_name, e.game_link, e.game_tid || 0, new Date()]
    })
    if (array.length === 0) {
        console.warn('this list is empty')
        if (callback) {
            callback(undefined)
        }
        return Promise.resolve()
    }
    return Pool.getPool().then(single => {
        return new Promise(function (resolve, reject) {
            single.query('insert into game (game_name, game_link, game_tid, timestamp) values ?', [array], (error, result, fields) => {
                if (error)  {
                    console.error(error)
                    reject(error)
                } else {
                    if (callback) {
                        callback(result)
                    }
                    console.log(`insert game  ${JSON.stringify(array)} successfully`)
                    single.release()
                    resolve(result)
                }
            })
        })
    })
}

function selectAllGame(callback) {
    return Pool.getPool().then(single => {
        return new Promise(function (resolve, reject) {
            single.query('select * from game', undefined, (error, result, fields) => {
                if (error)  {
                    console.error(error)
                    reject(reject)
                } else {
                    console.log('select successfully')
                    if (callback) {
                        callback(result)
                    }
                    single.release()
                    resolve(result)
                }
            })
        })

    })
}

function insertAnchor(anchorList, callback, ...params) {
    let array = anchorList.map(e => {
        return [e.anchor_name, e.room_url, e.room_id, e.room_name, e.online_data, e.type, e.sub_type, e.tags, e.snapshot_1, e.snapshot_2, new Date()]
    })
    if (array.length === 0) {
        console.log(`this anchorList from ${params[0]} is empty`)
        return
    }
    Pool.getPool().then(single => {
        single.query('insert into room (anchor_name, room_url, room_id, room_name, online_data, type, sub_type, tags, snapshot_1, snapshot_2, timestamp) values ?', [array], (err, result, fields) => {
            if (err) {
                console.error(err)
                console.log(JSON.stringify(anchorList))
                process.exit(-1)
            } else {
                console.log(`insert anchor ${params[0]} successfully`)
                if (callback) {
                    callback(result)
                }
                single.release()
            }
        })
    })
}

function selectAnchorBySubType (sub_type) {
    return Pool.getPool().then(instance => {
        return new Promise(function(resolve, reject) {
            instance.query('select * from room where sub_type=?', [sub_type], (err, results, fields) => {
                if (err) {
                    reject(err)
                } else {
                    instance.release()
                    resolve(results)
                }
            })
        })
    })
}
