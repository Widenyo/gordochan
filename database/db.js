const mysql = require('serverless-mysql')

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

db.connect( (e) => {
    if(e) return console.log(e)
    console.log('DB connected.')
})

db.on('error', () => db.connect())

module.exports = db