const fs = require('fs');
/**
 * [description]	
 * @param  {[type]}   filePath [description]	the path of the file to be written
 * @param  {[type]}   data     [description]	the data to be written
 * @param  {[type]}   flag     [description]	judge whether the file is created or overwrited
 * @param  {Function} callback [description]	something to do after successfully writing
 * @return {[type]}            [description]
 */
function write2File(filePath, data, flag, callback) {
	const buffer = new Buffer(data)
	if(flag) {
		fs.open(filePath, 'w+', (err, fd) => {
			fs.writeFile(fd, buffer, (err, written, buffer) => {
				if(callback) {
					callback()
				}
			})
		})
	} else {
		fs.appendFile(filePath, data, (err) => {
			if (err) {
				console.log(err)
				throw new Error(err)
			}
			if (callback) {
				callback()
			}
		})
	}
}
exports.write2File = write2File