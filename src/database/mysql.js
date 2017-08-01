const mysql = require('mysql')
const async = require('async')
const logger = require('../properties/logger').compLogger
const sql = require('./curd')
const pool = mysql.createPool({
	host:'43.245.223.183',
	user:'root',
	password:'xiii@2453',
	database:'douyu',
	port:3306
});
//异步函数一定要留callback参数

function createTable(createSql) {
	pool.getConnection((err, conn) => {
		if (err) {
			logger.error(err)
		} else {
			conn.query(createSql, (err, results) => {
				if(err) {
					logger.error(err)
				} else {
					logger.info(results)
					logger.info('创建成功')
				}
			})
		}
	})
}


function insert(table_name, insertParams, cb) {
	let insertExpression = []
	let interpolate = []
	let totalData = []
	for (let i in insertParams) {
		let insertData = []
		params = insertParams[i] 
		for(let j in params) {
			if (i == 0) {
				insertExpression.push(j)
				interpolate.push('?')
			}
			insertData.push(params[j])
		}
		totalData.push(insertData)
	}
	insertExpression = ' ( ' + insertExpression.join(',') + ' )'
	interpolate = ' ( ' + interpolate.join(',') + ' )'
	const insertSql = 'insert into ' + table_name  + insertExpression + ' values ' + interpolate;
	console.log(insertSql)
	async.each(totalData, (item, callback) => {
		pool.getConnection((err, conn) => {
			if(err) {
				logger.error(err)
				callback(err)
			} else {
				conn.query(insertSql, item, (err, results) => {
					if (err) {
						logger.info(insertParams)
						logger.error(err)
						callback(err)
					} else {
						callback()
						conn.release()
					}
				})
				
			}
		})
		
	}, (err) => {
		if (err) {

		} else {
			logger.info('数据全部插入成功')
			if(cb) {
				cb(null, '执行下一个操作')
			}
		}
	})
}

exports.insert = insert