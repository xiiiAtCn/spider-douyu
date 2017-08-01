const http = require('http')
const url = require('url')
const eventproxy = require('eventproxy')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')
const mysql = require('../database/mysql');
const logger = require('../properties/logger').compLogger

function appendData(anchorList, totalList, game_abbv) {
    let query_date = new Date()
    for(let i = 0; i < anchorList.length ; i++) {
        let anchor = anchorList[i]
        $ = cheerio.load(anchor)
        logger.info(anchorList.url)
        logger.info($.html())
        let room_code = $('a.play-list-link').attr('href').trim()
        let room_link = 'https://www.douyu.com' + room_code
        room_code = room_code.substr(1)
        let live_name = $('h3.ellipsis').text().trim()
        let anchor_nick = $('span.dy-name').text().trim()
        let watch_number = $('span.dy-num').text().trim()
        if (watch_number.endsWith('万')) {
            watch_number = parseFloat(watch_number) * 10000
        } else {
            watch_number = parseInt(watch_number)
        }
        let model = {
            query_date,
            room_code,
            live_name,
            room_link,
            anchor_nick,
            watch_number,
            game_abbv
        }
        totalList.push(model)
    }
}

function getAnchorInfo (params , cb) {
    let totalList = []
    let url = params.game_link
    superagent.get(url).end((err, body) => {
        let $ = cheerio.load(body.text)
        let noneMsg = $('.nonemsg')
        if(noneMsg.length === 1) {
            return
        }
        let anchorList = $('#live-list-contentbox > li')
        anchorList.url = url
        eval($('script')[5].children[0].data)
        let pages = $PAGE.pager.count
        appendData(anchorList, totalList, params.game_abbv)
        let flag
        if (pages > 1) {
            flag = [ ...Array(pages - 1)].map(() =>false)
        } else {
            mysql.insert('anchor', totalList, cb)
        }
        for (let i = 2; i <= pages; i++) {
            superagent.get(url + `?page=${i}&isAjax=1`).end((err, body) => {
                let $ = cheerio.load(body.text)
                let anchorList = $('li')
                appendData(anchorList, totalList, params.game_abbv)
                flag[i - 2] = true
                if(flag.every(value => value === true)) {
                    mysql.insert('anchor', totalList, cb)
                }
            })
        }
    }) 
}
exports.getAnchorInfo = getAnchorInfo
