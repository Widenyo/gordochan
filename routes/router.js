const express = require('express')
const router = express.Router()
const db = require('../database/db')
const auth = require('../controllers/authController')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const setPfp = require('../controllers/setPfp')
const postController = require('../controllers/postController')
const multer = require('multer')
const upload = multer({dest: '/public/images'})
const getRandomBanner = require('../controllers/getRandomBanner')







//VISTAS//

router.get("/", auth.isAuthenticated, async (req, res) => {

    try{
        const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
        db.query('SELECT * FROM users WHERE id = ?', [decode.id], (err, result)=>{
            if(result){
                let user = {
                    id: result[0].id,
                    user: result[0].user,
                    email: result[0].email,
                    avatar: result[0].avatar
                }
                db.query("SELECT * FROM users INNER JOIN post ON users.id = post.user_id JOIN post_image ON post_id = post.id", (err, result) => {
                    if(err){
                        console.log(err)
                    } 
                    if(result){
                        console.log(result)
                        if(result.length === 0) res.render('index', {user: user, posts: false, banner: getRandomBanner()});
                        let posts = result.map(p =>{
                            return {
                                post_id: p.post_id,
                                content: p.content,
                                date: p.date,
                                user_id: p.user_id,
                                user: p.user,
                                avatar: p.avatar,
                                anonimo: p.anonimo,
                                image: p.image,
                                parent: p.parent
                            }
                        })
                        res.render('index', {user: user, posts: posts, banner: getRandomBanner()});
                    }
                })
            }
            else return res.redirect('/login')
        })
    }catch(e){
        console.log(e)
        return res.redirect('/login')
    }
  });

router.get('/login', auth.isNotAuthenticated, (req, res) => {
    res.render('login', {error: false})
})

router.get('/register', auth.isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/post/:id', (req, res) => {

    const {id} = req.params

    db.query('SELECT * FROM post JOIN post_image ON post_id = post.id WHERE post.id = ?' , id, (err, r) => {
        if(r){
            if(r.length === 0) return res.render('post', {post: false, banner: getRandomBanner() }, )
            let post = r[0]

             db.query('SELECT post.id AS id, users.id AS user_id, content AS content, date AS date, anonimo AS anonimo, parent AS parent, avatar AS avatar, image AS image FROM post JOIN users ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE parent = ?;' , id, (err, r) =>{

                if(r.length > 0){
                    post.replies = r
                }
                else{
                    if(err) console.log(err)
                    post.replies = null

                } 
            })

            db.query('SELECT * FROM users WHERE id = ?', post.user_id, (err, r) => {
                if(r){
                    let user = r[0]
                    
                    let postData = {...post, user: {user_id: user.id, user: user.user, avatar: user.avatar}}

                    return res.render('post', {post: postData, banner: getRandomBanner()} )
                }
                if(err) console.log(err)
            })

        } 
        if(err) console.log(err)
    })
})


//CONTROLLER METHODS//


router.post('/register', auth.register)

router.post('/login', auth.login)

router.get('/logout', auth.logout)

router.post('/changePfp', setPfp.upload.single('avatar'), (req, res) =>{
    res.redirect('/')
})



router.post('/post', postController.uploadImg.single('image'), postController.createPost, (req, res) => {
    res.redirect('/')
})
router.post('/post/reply/:parentId', postController.uploadImg.single('image'), postController.createPost, (req, res) =>{
    res.redirect('/post/' +  req.params.parentId)
})



module.exports = router