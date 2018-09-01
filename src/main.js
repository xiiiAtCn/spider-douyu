const agent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const mysql = require('./database/curd')
let basePath = 'https://www.douyu.com'
let gameMap = {}

let gameArray =  []
agent.get(`${basePath}/directory/all`).then(res => {
    return res.text
}).then(data => {
    let $ = cheerio.load(data)
    let gameLinkList = $('.column-cont li')
    let moreArr = []
    gameLinkList.map((i,e) => {
        let obj = {}
        let children = e.children
        let child = children.filter(e => {
            return e.childNodes !== null && e.data === undefined
        })[0]
        if (child.attribs.class !== 'more') {
            gameMap[child.attribs.href] = obj
            obj.game_name = child.attribs.title
            obj.game_link = child.attribs.href
            obj.game_tid = Number(child.attribs['data-tid'])
        } else {
            obj.game_link = child.attribs.href
            moreArr.push(obj)
        }
    })
    return moreArr
}).then(array => {
    let requestArr = []
    array.forEach((e, index) => {
        requestArr.push(agent.get(`${basePath}${e.game_link}`))
        agent.get(`${basePath}${e.game_link}`)
    })
    return Promise.all(requestArr)
}).then(resArr => {
    resArr.forEach(res => {
        let $ = cheerio.load(res.text)
        let array = $('#live-list-content li')
        array.map((i, e) => {
            let child = e.children.filter(e => {
                return e.childNodes !== null && e.data === undefined
            })[0]
            if (gameMap[child.attribs.href]) {
                return
            } else {
                let obj = {
                    game_link: child.attribs.href,
                    game_tid: Number(child.attribs['data-tid']),
                    game_name: child.children[3].children[0].data
                }
                gameMap[child.attribs.href] = obj
            }
        })
    })
    mysql.selectAllGame().then(list => {
        list.forEach(e => {
            if (gameMap[e.game_link]) {
                delete gameMap[e.game_link]
            }
        })
        let gameArray = Object.values(gameMap)
        mysql.insertGame(gameArray).then(() => {
            process.exit()
        }, () => {
            process.exit()
        })
    })
})