const getRandomBanner = require('../../controllers/getRandomBanner')
const db = require('../../database/db')
const getBoardId = require('./getBoardId')
const paginated = 25

const getPosts = async (res, page, short, user, name) => {
    const startSelect = paginated * (page - 1)
    let postsQuery = await db.query(`SELECT * FROM users INNER JOIN post ON users.id = post.user_id JOIN post_image ON post_id = post.id JOIN board ON board.id = board WHERE board.short = "${short}" AND top_parent IS NULL ORDER BY bump LIMIT ${startSelect}, ${paginated}`)
    if(postsQuery.length === 0) return res.render('board', {user: user, posts: false, banner: getRandomBanner(), boardId: await getBoardId(short), short: short, boardName: name});
    let mappedPosts = postsQuery.map(p => {
        return {
            ...p,
            date: p.date.toLocaleTimeString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        }
    })
    return mappedPosts
    }

module.exports = getPosts;