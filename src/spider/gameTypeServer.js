const game = require('./getGameTypes')
const http = require('http')
const url = require('url')
const eventproxy = require('eventproxy')
const superagent = require('superagent')
const cheerio = require('cheerio')
const allGames = require('./allGames')
const host = 'https://www.douyu.com'
const rootHost = 'https://www.douyu.com/directory'

http.createServer((req, res) => {
	if(url.parse(req.url).path !== './favicon.ico') {
		superagent.get(rootHost).end((err, data) => {
			let dataType = game.getGameTypes(data.text)
			dataType.forEach((data) => {
				allGames.getAllGames(data['children'], data['name'])
			})
		})
	}
}).listen(8888)
console.log('start to listen to port 8888')

