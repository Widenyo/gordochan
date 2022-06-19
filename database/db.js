const db = require('serverless-mysql')()

db.config({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

console.log('DB connected')

module.exports = db