const express = require('express')
const router = express.Router()
const db = require('../database/db')
const auth = require('../controllers/authController')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const getRandomBanner = require('../controllers/getRandomBanner')

router.get('/:id', auth.isAuthenticated, async (req, res) => {
    let {id} = req.params

    db.query('SELECT * FROM users WHERE id = ?', id, async (err, r) => {
        if(r.length !== 0){
            try{
                let user = {
                    ...r[0],

                    join_date: r[0].join_date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                }
                const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
                db.query('SELECT * FROM users WHERE admin = 1 AND id = ?', [decode.id], (err, r) =>{
                    if(r.length !== 0) return res.render('profile', {user: user, banner: getRandomBanner(), admin: true} )
                    else return res.render('profile', {user: user, banner: getRandomBanner(), admin: false} )
                })

            } catch(e){
                return res.render('/')
            }

        }
        else return res.render('profile', {user: false, banner: getRandomBanner(), admin: false }, )
    })

})

module.exports = router;