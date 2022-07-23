const auth = require('../controllers/authController')
const {Router} = require('express');
const getThisUserById = require('../functions/getters/getThisUserById');
const router = Router()





router.get("/", auth.isAuthenticated, async (req, res) => {
    const user = await getThisUserById(req)
    try{
        return res.render('index', {user: user});
    }catch(e){
        return res.redirect('/login')
    }
  });

module.exports = router;