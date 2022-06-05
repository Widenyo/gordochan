const jwt = require('jsonwebtoken')
const db = require('../database/db')
const {promisify} = require('util')
const path = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/avatar')
    },
    filename: async (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        let name = Date.now() + path.extname(file.originalname)
        console.log(file)
        
        if(mimetype && extname) cb(null, name)
        else return

        try{
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
            db.query(`UPDATE users SET avatar='${name}' WHERE id = ?`, [decode.id])
        }catch(e){
            console.log(e)
        }

    }
})
exports.uploadPfp = multer({storage: storage,
limits: {fileSize: 8000000},
})

exports.updateInfo = async (req, res, next) =>{
    const {signature} = req.body

    try{
        const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
        db.query(`UPDATE users SET signature = ? WHERE id = ?`, [signature, decode.id], (e, r) => {
            if(r) next()
        })
    }catch(e){
        console.log(e)
    }


}