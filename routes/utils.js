const {Router} = require('express')
const router = Router()

const saucenaoRouter = require('./utils/saucenao.js')

router.use('/saucenao', saucenaoRouter)

module.exports = router