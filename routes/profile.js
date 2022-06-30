const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const getRandomBanner = require('../controllers/getRandomBanner')
const getThisUserById = require('../functions/getters/getThisUserById')

router.get('/:id', auth.isAuthenticated, async (req, res) => {
    let {id} = req.params

    let user = await getThisUserById(req, id)

    if(user) user = {...user, join_date: user.join_date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    else return res.render('profile', {user: false, banner: getRandomBanner(), admin: false }, ) 

    const visitor = await getThisUserById(req)

    return res.render('profile', {user: user, banner: getRandomBanner(), admin: visitor.admin} )

})

module.exports = router;