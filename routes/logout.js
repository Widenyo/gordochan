const auth = require('../controllers/authController')
const {Router} = require('express');
const router = Router()

router.get('/', auth.isAuthenticated, auth.logout)

module.exports = router;