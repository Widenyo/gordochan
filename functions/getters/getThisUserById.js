const db = require('../../database/db')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')

const getThisUserById = async (req, id) =>{
    if(typeof id === 'undefined') id = (await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)).id
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id])
    if(user.length === 1) return user[0]
    else return null
}

module.exports = getThisUserById;