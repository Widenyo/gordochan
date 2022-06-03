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
exports.upload = multer({storage: storage,
limits: {fileSize: 8000000},
})