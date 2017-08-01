const cheerio = require('cheerio')
function doms(document, criterion, condition, returnType) {
	let $ = cheerio.load(document)
	let doms = $(criterion).toArray()
	doms = doms.filter((current, index) => {
		current = $(current)
		return condition(current, index)
	}).map((value, num) => {
		value = $(value)
		return returnType(value, num)
	})
	return doms
}
exports.doms = doms