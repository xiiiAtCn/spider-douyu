let log4js = require('log4js')
let fs = require('fs')
let path = require('path')
let jsonConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, './log4js.json'), 'utf-8'))
log4js.configure(jsonConfig)

let cowLogger = log4js.getLogger('cow')
let fileLogger = log4js.getLogger('fileLog')

let compLogger = {}

let logLevel = ['info', 'debug', 'warn', 'error']

for (let i  in logLevel) {
    let level = logLevel[i]
    compLogger[level] = function(msg) {
        cowLogger[level](msg)
        fileLogger[level](msg)
    }
}

module.exports = {
    cowLogger, 
    fileLogger, 
    compLogger
}