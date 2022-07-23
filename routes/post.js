const express = require('express')
const router = express.Router()
const db = require('../database/db')
const auth = require('../controllers/authController')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const getRandomBanner = require('../controllers/getRandomBanner')
const postController = require('../controllers/postController')
const { deletePost } = require('../controllers/adminTools/postHandler')


router.get('/:id', auth.isAuthenticated, async (req, res) => {

    const {id} = req.params



    db.query('SELECT * FROM post JOIN post_image ON post_id = post.id WHERE post.id = ?' , id, async (err, r) => {
        if(r){
            if(r.length === 0) return res.render('post', {post: false, banner: getRandomBanner() }, )
            let post = r[0]

             db.query('SELECT users.user AS user, post.id AS id, users.id AS user_id, content AS content, date AS date, anonimo AS anonimo, parent AS parent, avatar AS avatar, image AS image FROM post JOIN users ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE parent = ?;' , id, (err, r) =>{

                if(r) if(r.length > 0) post.replies = r
                else{
                    if(err) console.log(err)
                    post.replies = null

                } 
            })

            db.query('SELECT * FROM users WHERE id = ?', post.user_id, async (err, r) => {
                if(r){
                    let user = r[0]
                    
                    let postData = {...post, user: {user_id: user.id, user: user.user, avatar: user.avatar}}

                    try{
                        const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
                        db.query('SELECT * FROM users WHERE admin = 1 AND id = ?', [decode.id], (err, r) =>{
                            if(r.length > 0) return res.render('post', {post: postData, banner: getRandomBanner(), admin: true} )
                            else return res.render('post', {post: postData, banner: getRandomBanner(), admin: false} )
                        })
                    } catch(e){
                        return res.render('/')
                    }
                }
                if(err) console.log(err)
            })

        } 
        if(err) console.log(err)
    })
})

router.post('/board/:id', auth.isAuthenticated, postController.uploadImg.single('image'), postController.createPost, async (req, res) => {
    res.redirect('back')
})

// router.post('/:id/reply/:parentId', auth.isAuthenticated, postController.uploadImg.single('image'), postController.createPost, (req, res) =>{
//     res.redirect('/post/' +  req.params.parentId)
// })

// router.get('/deletepost/:id', auth.isAuthenticated, auth.isAdmin, deletePost)

module.exports = router;