const baseUrl = require('../utils/const').baseUrl
const agent = require('superagent')
const execution = require('../database/execution')

function getAnchorData(data, callback) {
    data.forEach(async (element) => {
        await getData(element)
    })

}

getData = element => {
    let flag = true
    let count = 1
    let increment = 1
    if(increment <= count) {
        let url = `${baseUrl}/gapi/rkc/directory/2_${element['type_tid']}/${increment}`
        agent.get(url)
            .then(data => JSON.parse(data.text))
            .then(data => {
                if(flag) {
                    count = data.data.pgcnt
                }
                flag = false
                increment++
                data = data.data.rl
                let finalData = data.map(element => [element['nn'], `${baseUrl}${element['url']}`, 
                    element['rn'], element['ol'], element['rs1'], (element['utag'] || []).map(tag => tag.name).join(',')])
                if(finalData.length === 0) {
                    return
                }
                execution.insertData('game_anchor', '', [finalData], (err) => {
                    if(err) {
                        console.log(url)
                        console.log(finalData)
                        console.log(err)
                        callback(err)
                    }
                })
            })
    }
}



module.exports = {
    getAnchorData
}