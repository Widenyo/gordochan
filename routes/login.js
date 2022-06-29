
const {Router} = require('express');
const router = Router()
const auth = require('../controllers/authController')

router.get('/', auth.isNotAuthenticated, (req, res) => {
    res.render('login', {error: false})
})

router.post('/', auth.login)

module.exports = router;