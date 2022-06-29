const db = require('../database/db')
const auth = require('../controllers/authController')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const getRandomBanner = require('../controllers/getRandomBanner')
const {Router} = require('express');
const router = Router()

const paginated = 25


router.get("/:page", auth.isAuthenticated, async (req, res) => {

    const page = parseInt(req.params.page)


    const startSelect = paginated * (page - 1)

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
                db.query(`SELECT * FROM users INNER JOIN post ON users.id = post.user_id JOIN post_image ON post_id = post.id WHERE top_parent IS NULL ORDER BY bump LIMIT ${startSelect}, ${paginated}`, (err, result) => {
                    if(err){
                        console.log(err)
                    } 
                    if(result){
                        let posts = result.length !== 0 && result.map(p =>{
                            return {
                                post_id: p.post_id,
                                content: p.content,
                                date: p.date.toLocaleTimeString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                                user_id: p.user_id,
                                user: p.user,
                                avatar: p.avatar,
                                anonimo: p.anonimo,
                                image: p.image,
                                parent: p.parent,
                                signature: p.signature
                            }
                        })
                        db.query("SELECT COUNT(*) FROM post WHERE top_parent IS NULL", (err, result) => {
                            let lastPage = Math.ceil(result[0]['COUNT(*)']/paginated)
                            if(page > lastPage) return res.redirect('/page/' + lastPage)
                            else return res.render('index', {user: user, posts: posts, banner: getRandomBanner(), page: page, lastPage: lastPage});
                        })
                    }
                })
            }
            else return res.redirect('/login')
        })
    }catch(e){
        return res.redirect('/login')
    }
  });

module.exports = router;