const cheerio = require('cheerio')
const baseUrl = require('../utils/const').baseUrl
const mysql = require('../database/mysql')
const sqlExp = require('../database/curd')

function getGameList(data) {
    let $ = cheerio.load(data.text)
    const content = $('#live-list-contentbox')[0]
    let gameList = content.children
    //全部类型游戏信息
    let containerList = []
    gameList.map(game => {
        //白名单， 只处理li标签内的内容
        if(game.name === 'li') {
            //存放每种游戏信息
            let container = {}
            let children = game.children
            children.forEach(child => {
                if(child.tagName === 'a') {
                    let href = child.attribs.href
                    container['type_link'] = baseUrl + href
                    container['type_abbr'] = href.substring(href.lastIndexOf('/') + 1)
                    let grandChildren = child.children
                    grandChildren.forEach(grand => {
                        switch(grand.name) {
                        case 'img':
                            container['game_figure'] = grand.attribs.src
                            break
                        case 'p':
                            container['type_name'] = grand.children[0].data
                            break
                        default:
                            break
                        }
                    })
                }
            })
            containerList.push(container)
        }
    })
    return containerList
}

function createTable(table_name, callback) {
    getSinglePool((err, single) => {
        if(err) {
            callback(err)
            return
        }
        single.query(sqlExp.create[table_name](),(err, results) => {
            single.release()
            if(err) {
                callback(err)
            } else {
                callback(null, results)
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

function insertData(table_name, data, callback) {
    getSinglePool(( err, single) => {
        if(err) {
            callback(err)
            return
        }
        single.query(sqlExp.insert[table_name](), data, (err, results, fields) => {
            single.release()
            if(err) {
                if(err.errno === 1146) {
                    createTable(table_name, (err) => {
                        if(err) {
                            callback(err)
                        } else {
                            insertData(table_name, data, callback)
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


module.exports = {
    getGameList,
    insertData
}