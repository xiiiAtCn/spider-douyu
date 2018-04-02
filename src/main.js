const agent = require('superagent')
const baseUrl = require('./utils/const').baseUrl
const gameType = require('./analysis/game-link')
const anchor = require('./analysis/anchor-link')

agent.get(`${baseUrl}/directory`).then(data => {
    let gameList = gameType.getGameList(data)
    let bak = gameList.slice()
    gameList = gameList.map(element => [element['type_link'], element['type_abbr'], element['game_figure'], element['type_name'], element['type_tid']])
    //too hard to understand this shit
    let date = new Date()
    let appendix = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDay()
    gameType.insertData('live_game', appendix, [gameList], (err, results, fields) => {
        if(err) {
            throw err
        } else {
            console.log(results)
            console.log(fields)
            anchor.getAnchorData(bak, (err) => {
                if(err) {
                    console.error(err)
                }
            })
        }
    })
}).catch(err => {
    console.error(err)
})