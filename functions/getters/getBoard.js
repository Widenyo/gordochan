const db = require('../../database/db')

const getBoard = async (shortOrId) => {
    let board = []
    if(!parseInt(shortOrId))board = await db.query(`SELECT * FROM board WHERE short = "${shortOrId}"`)
    else board = await db.query(`SELECT * FROM board WHERE id = ?`, [shortOrId])
    return board[0]
}

module.exports = getBoard;