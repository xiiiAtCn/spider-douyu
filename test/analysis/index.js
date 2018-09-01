const agent = require('superagent')
const fs = require('fs')

let baseUrl = "https://www.douyu.com"
let page = 1
let array = []
function fetch() {
    agent.get(`${baseUrl}/gapi/rkc/directory/2_1/${page}`).then(res => {
        let data = res.body
        let pageCount = data.data.pgcnt
        array = array.concat(data.data.rl)
        console.log(JSON.stringify(data))
        if (page < pageCount) {
            page++
            fetch()
        }
        if (page === pageCount) {
            fs.writeFile('./room.json', JSON.stringify(array), (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log('write successfully')
            })
        }
    })
}

fetch()