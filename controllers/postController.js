const jwt = require('jsonwebtoken')
const db = require('../database/db')
const {promisify} = require('util')
const path = require('path')
const multer = require('multer')

exports.createPost = async (req, res) => {

    let {content, anon} = req.body

    if(anon === 'on') anon = 1
    else anon = 0

    console.log(anon)

    try{
    const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    db.query('INSERT INTO post SET ?', {user_id: decode.id, content:content, anonimo: anon}, (e, r) =>{
        if(e){
            res.redirect('/')
        }

        else{
            res.redirect('/')
        }
    })
}
    catch(e){
        console.log('Se produjo un error inesperado.')
        res.redirect('/')
    }
}