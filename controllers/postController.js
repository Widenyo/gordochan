const jwt = require('jsonwebtoken')
const db = require('../database/db')
const {promisify} = require('util')
const path = require('path')


const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: async (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        let name = Date.now() + path.extname(file.originalname)
        console.log(file)
        
        if(mimetype && extname) cb(null, name)
        else return

        req.body.image = name
    }
})

exports.uploadImg = multer({storage: storage, limits: {fileSize: 8000000}})





exports.createPost = async (req, res, next) => {

    let {content, anon, image} = req.body
    let parentId = req.params.parentId

    if(anon === 'on') anon = 1
    else anon = 0

    if(content.length === 0 && !image) return res.redirect('/')


    try{
    const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    db.query('INSERT INTO post SET ?', {user_id: decode.id, content:content, anonimo: anon, parent: parentId}, (e, r) =>{
        console.log(r)
        if(e){
            res.redirect('/')
        }

        else{
            let postId = r.insertId
            
            db.query('INSERT INTO post_image SET ?', {image: image, post_id: postId}, (e, r) =>{if(e) return})
            next()
        }
    })
}
    catch(e){
        console.log('Se produjo un error inesperado.')
        res.redirect('/')
    }
}