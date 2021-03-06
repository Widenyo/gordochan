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


const commentPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/commentPics')
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




exports.uploadCommentImg = multer({storage: commentPicStorage, limits: {fileSize: 16000000}})

exports.uploadImg = multer({storage: storage, limits: {fileSize: 16000000}})





exports.createPost = async (req, res, next) => {

    let {content, anon, image, reddit} = req.body
    let parentId = req.params.parentId
    const boardId = req.params.id
    const boardq = await db.query(`SELECT * FROM board WHERE id = ?`, [boardId])
    if(!boardq.length) return res.send('no loops')
    if(anon === 'on') anon = 1
    else anon = 0

    if(content === "" && !image) return res.redirect('/')


    try{
    const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    db.query('INSERT INTO post SET ?', {user_id: decode.id, content:content, anonimo: anon, parent: parentId, phone: reddit === 'true' ? 1 : 0, board: boardId}, (e, r) =>{
        if(e){
            return res.redirect('/')
        }

        else{
            let postId = r.insertId

            if(parentId){
                db.query('SELECT * from post WHERE id = ?', parentId, (err, r) =>{
                    if(!r.length) return res.send('no loops')
                    if(!r[0].parent){
                        db.query(`UPDATE post SET top_parent = ? WHERE id = ${postId}`, r[0].id)
                        db.query('UPDATE post SET bump = 0 WHERE id = ?', r[0].id)
                    }
                    else{
                        db.query(`UPDATE post SET top_parent = ? WHERE id = ${postId}`, r[0].top_parent)
                        db.query('UPDATE post SET bump = 0 WHERE id = ?', r[0].top_parent)
                    }
                })
            }
            
            db.query('INSERT INTO post_image SET ?', {image: image, post_id: postId}, (e, r) =>{if(e) return})
            db.query('UPDATE post SET bump = bump + 1 WHERE parent IS NULL')


            next()
        }
    })
}
    catch(e){
        console.log('Se produjo un error inesperado.')
        res.redirect('/')
    }
}