const db = require('../../database/db')
const paginated = 25

const getLastPage = async (boardId) => {
    const count = await db.query("SELECT COUNT(*) FROM post WHERE board = ? AND top_parent IS NULL", [boardId])
    return Math.ceil(count[0]['COUNT(*)']/paginated)
}

module.exports = getLastPage;