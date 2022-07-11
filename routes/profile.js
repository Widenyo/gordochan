const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const getRandomBanner = require('../controllers/getRandomBanner')
const getThisUserById = require('../functions/getters/getThisUserById')
const db = require('../database/db')
const { uploadCommentImg } = require('../controllers/postController')

router.get('/:id', auth.isAuthenticated, async (req, res) => {
    let {id} = req.params

    let user = await getThisUserById(req, id)

    if(user) user = {...user, join_date: user.join_date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    else return res.render('profile', {user: false, banner: getRandomBanner(), admin: false }, ) 

    const visitor = await getThisUserById(req)
    const comments = await db.query('SELECT *, comments.id AS id FROM comments JOIN users ON users.id = author_id WHERE profile_id = ? ORDER BY comments.id DESC' ,[user.id])
    console.log(comments)

    return res.render('profile', {user: user, banner: getRandomBanner(), admin: visitor.admin, comments: comments} )

})

router.post('/comment/:id', auth.isAuthenticated, uploadCommentImg.single('image'), async (req, res) => {
    
    let {id} = req.params

    let {image, content, anon} = req.body

    anon = anon === 'on' ? 1 : 0
    if(!content && !image) return res.redirect('/profile/' + id)

    const profile = await getThisUserById(req, id)
    const author = await getThisUserById(req)

    try{
    const comment = await db.query('INSERT INTO comments SET ?', {author_id: author.id, profile_id: profile.id, content:content, anon: anon, image: image ? image : null})
    }catch(e){
        console.log(e)
    }

    return res.redirect('/profile/' + id)

})

module.exports = router;