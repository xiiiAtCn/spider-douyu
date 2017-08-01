const filters = require('./filters')
const superagent = require('superagent')
const cheerio = require('cheerio')
const host = 'https://www.douyu.com'
function getSubGames(document) {
	const selector = 'ul>li>a'
	const subGames = filters.doms(document.toString(), selector, showGames, returnType)
	return subGames
}

function getLinkedGames(document) {
	const selector = 'ul li a'
	const linkedNode = filters.doms(document.toString(), selector, linkedGames, returnType)
	if (linkedNode.length > 1) {
		throw new Error('some wrong')
	}
	let subGames = []
	if (linkedNode.length == 1) {
		superagent.get(linkedNode[0]['url']).end(function(err, pres) {			//此处的异步过程如何解决
			let $ = cheerio.load(pres.text)
			const subLinks = $('.item-data .unit .thumb').toArray();
			subLinks.map(function(link, num) {
				const name = $(link).children().eq(1).text()
				const temp = $(link).children().eq(1).text() + ':' + host + $(link).attr('href').trim() + '\n';
				const url = host + $(link).attr('href').trim()
				subGames.push({name:name, url:url})
			})
		})
	}
}

function getAllGames(document, type) {
	let subGames = getSubGames(document)
	let linkedGames = getLinkedGames(document)
	console.log('subGames',subGames)
	console.log('linkedGames',linkedGames)
}

function showGames(current, index) {
	return current.attr('title') !== undefined
}

function returnType(current, index) {
	return {name:current.attr('title'), url:host + current.attr('href')}
}

function linkedGames(current, index) {
	return current.attr('title') === undefined
}

exports.getAllGames = getAllGames