const db = require('../../database/db')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')

const getThisUserById = async (req, res) => {
    try{
    const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    const user = await db.query('SELECT * FROM users WHERE id = ?', [decode.id])
    return user[0]
    }catch(e){
        res.send('/login')
    }

}

module.exports = getThisUserById;