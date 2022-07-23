const db = require('../../database/db')

const getBoard = async (short) => {
    const board = await db.query(`SELECT * FROM board WHERE short = "${short}"`)
    return board[0]
}

module.exports = getBoard;