const express = require('express')
const router = express.Router()
const db = require('../database/db')
const auth = require('../controllers/authController')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const setInfo = require('../controllers/setInfo')
const postController = require('../controllers/postController')
const getRandomBanner = require('../controllers/getRandomBanner')
const { deletePost } = require('../controllers/adminTools/postHandler')
const { ban } = require('../controllers/adminTools/ban')

const paginated = 25






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
                db.query("SELECT * FROM users INNER JOIN post ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE top_parent IS NULL ORDER BY bump LIMIT " + paginated, (err, result) => {
                    if(err){
                        console.log(err)
                    } 
                    if(result){
                        if(result.length === 0) return res.render('index', {user: user, posts: false, banner: getRandomBanner()});
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
                                parent: p.parent,
                                signature: p.signature
                            }
                        })
                        return res.render('index', {user: user, posts: posts, banner: getRandomBanner()});
                    }
                })
            }
            else return res.redirect('/login')
        })
    }catch(e){
        return res.redirect('/login')
    }
  });

  router.get("/page/:page", auth.isAuthenticated, async (req, res) => {

    const page = parseInt(req.params.page)


    const startSelect = paginated * (page - 1)
    const endSelect = paginated * page

    if(page <= 0 || !(parseInt(page))) return res.redirect('https://www.youtube.com/watch?v=03SIKP4sVfY')
    if(page === 1) return res.redirect('/')


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
                db.query(`SELECT * FROM users INNER JOIN post ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE top_parent IS NULL ORDER BY bump LIMIT ${startSelect}, ${endSelect}`, (err, result) => {
                    if(err){
                        console.log(err)
                    } 
                    if(result){
                        if(result.length === 0) return res.render('index', {user: user, posts: false, banner: getRandomBanner()});
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
                                parent: p.parent,
                                signature: p.signature
                            }
                        })
                        return res.render('index', {user: user, posts: posts, banner: getRandomBanner()});
                    }
                })
            }
            else return res.redirect('/login')
        })
    }catch(e){
        return res.redirect('/login')
    }
  });

router.get('/login', auth.isNotAuthenticated, (req, res) => {
    res.render('login', {error: false})
})

router.get('/register', auth.isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/post/:id', auth.isAuthenticated, async (req, res) => {

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

router.get('/profile/:id', auth.isAuthenticated, async (req, res) => {
    let {id} = req.params

    db.query('SELECT * FROM users WHERE id = ?', id, async (err, r) => {
        if(r.length !== 0){
            let user = r[0]
            try{
                const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
                db.query('SELECT * FROM users WHERE admin = 1 AND id = ?', [decode.id], (err, r) =>{
                    if(r.length !== 0) return res.render('profile', {user: user, banner: getRandomBanner(), admin: true} )
                    else return res.render('profile', {user: false, banner: getRandomBanner(), admin: false} )
                })
            } catch(e){
                return res.render('/')
            }

        }
        else return res.render('profile', {user: false, banner: getRandomBanner(), admin: false }, )
    })

})


//CONTROLLER METHODS//


router.post('/register', auth.register)

router.post('/login', auth.login)

router.get('/logout', auth.isAuthenticated, auth.logout)

router.post('/changePfp', auth.isAuthenticated, setInfo.uploadPfp.single('avatar'), (req, res) =>{
    res.redirect('/')
})

router.post('/updateInfo', auth.isAuthenticated, setInfo.updateInfo, (req, res) => {
    res.redirect('/')
})



router.post('/post', auth.isAuthenticated, postController.uploadImg.single('image'), postController.createPost, (req, res) => {
    res.redirect('/')
})
router.post('/post/reply/:parentId', auth.isAuthenticated, postController.uploadImg.single('image'), postController.createPost, (req, res) =>{
    res.redirect('/post/' +  req.params.parentId)
})

//ADMIN METHODS//

router.get('/post/deletepost/:id', auth.isAuthenticated, auth.isAdmin, deletePost)

router.get('/ban/:id', auth.isAuthenticated, auth.isAdmin, ban)



module.exports = router