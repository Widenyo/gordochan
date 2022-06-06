const db = require("../../database/db")

exports.ban = (req, res) => {

    let {id} = req.params

    db.query('UPDATE users SET banned = 1 WHERE id = ?', id, (err, r) =>{
        return res.redirect('/')
    })

}