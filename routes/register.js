
const {Router} = require('express');
const router = Router()
const auth = require('../controllers/authController')

router.get('/', auth.isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.post('/', auth.register)

module.exports = router;