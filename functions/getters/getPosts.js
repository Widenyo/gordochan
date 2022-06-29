const db = require('../../database/db')
const paginated = 25

const getPosts = async (res, page) => {
    let postsQuery = await db.query(`SELECT * FROM users INNER JOIN post ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE top_parent IS NULL ORDER BY bump LIMIT ${page}, ${paginated}`)
    if(postsQuery.length === 0) return res.render('index', {user: user, posts: false, banner: getRandomBanner()});
    let mappedPosts = postsQuery.map(p => {
        return {
            ...p,
            date: p.date.toLocaleTimeString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        }
    })
    return mappedPosts
    }

module.exports = getPosts;