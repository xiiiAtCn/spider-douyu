const agent = require('superagent')
const cheerio = require('cheerio')
const mysql = require('../database/curd')
const basePath = 'https://www.douyu.com'

mysql.selectAllGame(result => {
    anchorHandler(result)
})

let obj = {}

async function anchorHandler(list) {
    for (let i = 0; i < list.length; i++) {
        try {
            obj[`${basePath}/gapi/rkc/directory/2_${list[i]['game_tid']}/1`] = true
            let res = await agent.get(`${basePath}/gapi/rkc/directory/2_${list[i]['game_tid']}/1`)
            res = JSON.parse(res.text)
            if (res.code === 0) {
                let { data } = res
                mysql.insertAnchor(formatAnchor(data.rl), () => {
                    delete obj[`${basePath}/gapi/rkc/directory/2_${list[i]['game_tid']}/1`]
                }, `${basePath}/gapi/rkc/directory/2_${list[i]['game_tid']}/1`)
                let totalPage = data.pgcnt
                for (let j = 2; j < totalPage; j++) {
                    let url = `${basePath}/gapi/rkc/directory/2_${list[i]['game_tid']}/${j}`
                    obj[url] = true
                    let nextPage = await agent.get(`${basePath}/gapi/rkc/directory/2_${list[i]['game_tid']}/${j}`)
                    nextPage = JSON.parse(nextPage.text)
                    mysql.insertAnchor(formatAnchor(nextPage.data.rl), () => {
                        delete obj[url]
                    }, url)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    console.log('spider end')
    process.exit(0)
    setInterval(() => {
        if (Object.keys(obj).length === 0) {
            process.exit(0)
        }
    }, 1000)
}

// anchorHandler(list)

function formatAnchor (list) {
    return list.map(e => ({
        anchor_name: e.nn, 
        room_url: `${basePath}/${e.rid}`, 
        room_id: e.rid, 
        room_name: e.rn, 
        online_data: e.ol, 
        type: e.cid1,
        sub_type: e.cid2,
        tags: e.utag ? e.utag.map(e => e.id).join() :'', 
        snapshot_1: e.rs1 || '',
        snapshot_2: e.rs2 || ''
    }))
}
