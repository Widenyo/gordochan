const db = require('../../database/db')
const paginated = 25

const getLastPage = async () => {
    const count = await db.query("SELECT COUNT(*) FROM post WHERE top_parent IS NULL")
    return Math.ceil(count[0]['COUNT(*)']/paginated)
}

module.exports = getLastPage;