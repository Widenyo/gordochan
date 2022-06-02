const jwt = require('jsonwebtoken')
const db = require('../database/db')
const {promisify} = require('util')
const path = require('path')
const multer = require('multer')

exports.createPost = async (req, res) => {

    const {content} = req.body

    try{
    const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    db.query('INSERT INTO post SET ?', {user_id: decode.id, content:content}, (e, r) =>{
        if(e){
            console.log(e)
            res.redirect('/')
        }

        else{
            console.log(r)
            res.redirect('/')
        }
    })
}
    catch(e){
        console.log('Se produjo un error inesperado.')
        res.redirect('/')
    }
}