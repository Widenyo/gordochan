const db = require('../../database/db')

const getBoardId = async (short) => {
    const id = await db.query(`SELECT id FROM board WHERE short = "${short}"`)
    return id[0].id
}

module.exports = getBoardId;