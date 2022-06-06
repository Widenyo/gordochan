const db = require("../../database/db")
const fs = require('fs')

const imageFolder = __dirname + '/../../public/images/';


exports.deletePost = (req, res) => {
    let {id} = req.params

    db.query('DELETE FROM post WHERE id = ?', [id, id], (err) => {return console.log(err)})
    db.query('SELECT * FROM post_image WHERE post_id = ?', id, (err, res) => {
        if(err) return console.log(err)
        res.forEach(i => {
            if(i.image) fs.unlinkSync(imageFolder + i.image)
        })
    })
    db.query('DELETE FROM post_image WHERE post_id = ?', id)

    res.redirect('/')
}