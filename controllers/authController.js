const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../database/db')
const {promisify} = require('util')






exports.register = async (req, res) => {
    const {user, password} = req.body

    try{
    const salt = await bcrypt.genSalt()
    let hashedPass = await bcrypt.hash(password, salt)
    db.query('INSERT INTO users SET ?', {user: user, password: hashedPass}, (e, r) =>{
        if(e){
            res.redirect('/register')
        }
        else res.redirect('/')
    })
    }catch(e){
        console.log('Se produjo un error inesperado.')
        res.redirect('/register')
    }
}

exports.login = async (req, res) => {
    let {user, password} = req.body

    var ip = req.headers['X-Forwarded-For']
    console.log(ip)
    console.log(req.ip)

    if(!user || !password){
        return res.render('login', {error: true})
    }

    try{
    db.query('SELECT * FROM users WHERE user = ?', [user], async (e, u) =>{
        if(u.length === 0 || !(await bcrypt.compare(password, u[0].password))) return res.render('login', {error: true})
        else{
            const selectedUser = u[0]
            const id = selectedUser.id
            const token = jwt.sign({id:id}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '7d'
            })

            const cookiesOptions = {
                expires: new Date(Date.now()+604800*24*60*60*1000),
                httpOnly: true
            }

            res.cookie('jwt', token, cookiesOptions)
            res.redirect('/')
        }
    })
    }catch(e){
        return res.render('login', {error: true})
    }

}

exports.isAuthenticated = async (req, res, next) => {
    if(req.cookies.jwt){
        try{
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
            db.query('SELECT * FROM users WHERE id = ?', [decode.id], (err, res)=>{
                if(res) return next()
                else return res.redirect('/login')
            })
        }catch(e){
            return res.redirect('/login')
        }
    }
    else{
        return res.redirect('/login')
    }
}

exports.isNotAuthenticated = async (req, res, next) => {
    if(req.cookies.jwt) return res.redirect('/')
    else next()
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/login')
}

