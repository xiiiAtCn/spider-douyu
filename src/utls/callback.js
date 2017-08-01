function exitSituation(outterIerator, outterLength, innerIterator, innerLength) {
	if(outterIerator.length -1 === outterLength && innerIterator.length -1 === innerLength) {
		return () => process.exit(0)
	}
}
exports.exit = exitSituation