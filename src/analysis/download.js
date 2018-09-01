const fs = require('fs')
const mysql = require('../database/curd')
const agent = require('superagent')
const path = require('path')

async function download() {
    mysql.selectAnchorBySubType(201).then(list => {
        (async () => {
            for (let i = 0; i < list.length - 1; i++) {
                let item = list[i]    
                let res = await agent.get(item.snapshot_1)
                let name = item.snapshot_1.substring(item.snapshot_1.lastIndexOf('/') + 1)
                fs.writeFile(path.resolve(__dirname, '../../resource/images/girls', name), res.body, err => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(`save  ${i}-${list.length - 1} picture ${name} successfully`)
                    }
                })
                if (item.snapshot_2) {
                    let name = item.snapshot_1.substring(item.snapshot_2.lastIndexOf('/') + 1)
                    fs.writeFile(path.resolve(__dirname, '../../resource/images/girls', name), res.body, err => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(`save ${i}-${list.length - 1} picture ${name} successfully`)
                        }
                    })
                }
            }
        })()
    })
}

download()