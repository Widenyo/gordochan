const db = require("../database/db")

exports.boardExists = async (req, res, next) => {

    const {board} = req.params

    const existe = await db.query(`SELECT * FROM board WHERE short = "${board}"`)

    if(!existe.length) return res.send('no existe ese board :v')

    next()
}