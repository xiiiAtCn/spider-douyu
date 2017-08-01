const filters = require('./filters')


function getGameTypes(document) {

	const selector = '.left-menu .leftnav-cate .column-cont dl dd'
	const  gameTypes = filters.doms(document, selector, condition, returnType)
	return gameTypes
}

function condition(current, index) {
	return true
}

function returnType(current, index) {
	return {name:current.attr('data-left-item'), children:current.children()}
}

exports.getGameTypes = getGameTypes
