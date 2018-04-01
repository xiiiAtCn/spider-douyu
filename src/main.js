const agent = require('superagent')
const baseUrl = require('./utils/const').baseUrl
const gameType = require('./analysis/game-link')

agent.get(`${baseUrl}/directory`).then(data => {
    let gameList = gameType.getGameList(data)
    gameList = gameList.map(element => [element['type_link'], element['type_abbr'], element['game_figure'], element['type_name']])
    //too hard to understand this shit
    gameType.insertData('live_game', [gameList], (err, results, fields) => {
        if(err) {
            throw err
        } else {
            console.log(results)
            console.log(fields)
        }
    })
}).catch(err => {
    console.error(err)
})