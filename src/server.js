const http = require('http')
const url = require('url')
const eventproxy = require('eventproxy')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')
const mysql = require('./database/mysql');
const anchor = require('./spider/getAnchor')
let proxy = new eventproxy()
const host = 'https://www.douyu.com'
const rootHost = 'https://www.douyu.com/directory'
let urlArray = []
let hotTypesLinks = []
const logger = require('./properties/logger').compLogger

http.createServer(function(req, res) {
	if(url.parse(req.url).path !== '/favicon.ico') {
		let gameList = []
		let abbvList = []
		superagent.get(rootHost).end((err, pres) => {
			let $ = cheerio.load(pres.text)
			let moreShow = $('#left .leftnav-cate .r-cont a.more')
			let extraTypeLinks = moreShow.map((index, link) => {
				return host + $(link).attr('href');
			})
			hotTypesLinks = $('.left-menu .leftnav-cate .r-cont.column-cont dl dt')
			let query_date = new Date()
			for (let i = 0; i < hotTypesLinks.length; i++) {
				let hotType = hotTypesLinks[i]
				let query = cheerio.load(hotType.children[1])
				let game_type = query('a').attr('href')
				game_type = game_type.substr(game_type.lastIndexOf('/') + 1)
				query = cheerio.load(hotType.next.next)
				let shownGames = query('a')
				let test = shownGames.map((index, value ) => {
						if(value.attribs['title'] !== undefined) {
							return value
					}
				}).map((index, value) => {
					let game_link = host + value.attribs['href']
					let game_name = value.attribs['title']
					let game_abbv = game_link.substr(game_link.lastIndexOf('/') + 1)
					let temp = {
						game_type,
						game_link,
						game_name,
						game_abbv,
						query_date
					}
					abbvList.push(game_abbv)
					gameList.push(temp)
					return value
				})
			}
			logger.info(gameList)
			logger.info($.html())


			for(let i = 0; i < extraTypeLinks.length; i ++) {
				proxy.emit('extraTypeLinks', extraTypeLinks[i])
			}
			res.end('')
		});
		let flagArray = [false, false, false, false]
		proxy.after('extraTypeLinks', 4, (extraTypeLinks) => {
			extraTypeLinks.map((links, index) => {
				superagent.get(links).end((err, pres) => {
					const $ = cheerio.load(pres.text)
					$('.item-data .unit .thumb').map((num, link) => {	
						let query_date = new Date()
						let game_type = links.split('/').pop()
						const game_name = $(link).children().eq(1).text()
						const temp = $(link).children().eq(1).text() + ':' + host + $(link).attr('href').trim() + '\n';
						const game_link = host + $(link).attr('href').trim()
						const game_abbv = game_link.substr(game_link.lastIndexOf('/') + 1)
						if(abbvList.indexOf(game_abbv) !== -1) {

						} else {
							abbvList.push(game_abbv)
							gameList.push({game_type, game_name, game_abbv, game_link, query_date})
						}
					})
					flagArray[index] = true;
					let a = setInterval(() =>{logger.info('waiting for ...')}, 2000)
					if(flagArray.every((current) => current == true)) {
						mysql.insert('live_game', gameList)
						async.mapLimit(gameList, 10, (params,callback) => {
							console.log(params)
							anchor.getAnchorInfo(params, callback)
						}, () => {
							logger.info('数据插入执行完毕')
							clearInterval(a)
						})
					}
				})
			})
		})
	}
}).listen(9000)
logger.info('start listening to port 9000')