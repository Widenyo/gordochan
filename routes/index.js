const auth = require('../controllers/authController')
const getRandomBanner = require('../controllers/getRandomBanner')
const {Router} = require('express');
const getPosts = require('../functions/getters/getPosts')
const getLastPage = require('../functions/getters/getLastPage')
const getThisUserById = require('../functions/getters/getThisUserById')
const router = Router()





router.get("/", auth.isAuthenticated, async (req, res) => {

    

    try{

        const user = await getThisUserById(req)

        const posts = await getPosts(res, 1)

        const lastPage = await getLastPage()

        return res.render('index', {user: user, posts: posts, banner: getRandomBanner(), page: 1, lastPage: lastPage});
    }catch(e){
        return res.redirect('/login')
    }
  });

module.exports = router;