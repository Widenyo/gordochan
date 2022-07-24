const express = require('express')
const router = express.Router()
const db = require('../database/db')
const auth = require('../controllers/authController')
const getRandomBanner = require('../controllers/getRandomBanner')
const postController = require('../controllers/postController')
const getThisUserById = require('../functions/getters/getThisUserById')
const getBoard = require('../functions/getters/getBoard')


router.get('/:id', auth.isAuthenticated, async (req, res) => {

    const {id} = req.params

    const postq = await db.query('SELECT * FROM post JOIN post_image ON post_id = post.id WHERE post.id = ?' , id)
    if(!postq.length) return res.render('post', {post: false, banner: getRandomBanner(), board: null })

    const post = postq[0]
    const board = await getBoard(post.board)

    const parentOrTop = !post.top_parent ? "top_parent" : "parent"
    
    const repliesq = await db.query(`SELECT users.user AS user, post.id AS id, users.id AS user_id, content AS content, date AS date, anonimo AS anonimo, parent AS parent, avatar AS avatar, image AS image FROM post JOIN users ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE ${parentOrTop} = ?;` , id)
    if(repliesq.length) post.replies = repliesq
    else post.replies = null

    const user = await getThisUserById(req, post.user_id)
    let postData = {...post, user: {user_id: user.id, user: user.user, avatar: user.avatar}}
    return res.render('post', {post: postData, banner: getRandomBanner(), admin: user.admin, board: board})
})

router.post('/board/:id', auth.isAuthenticated, postController.uploadImg.single('image'), postController.createPost, async (req, res) => {
    res.redirect('back')
})

router.post('/board/:id/reply/:parentId', auth.isAuthenticated, postController.uploadImg.single('image'), postController.createPost, (req, res) =>{
    res.redirect('/post/' +  req.params.parentId)
})

module.exports = router;