const auth = require('../controllers/authController')
const getRandomBanner = require('../controllers/getRandomBanner')
const {Router} = require('express');
const getPosts = require('../functions/getters/getPosts')
const getLastPage = require('../functions/getters/getLastPage')
const getThisUserById = require('../functions/getters/getThisUserById')
const router = Router()


router.get("/:page", auth.isAuthenticated, async (req, res) => {

    const page = parseInt(req.params.page)

    if(page <= 0 || !(parseInt(page))) return res.redirect('https://www.youtube.com/watch?v=03SIKP4sVfY')
    if(page === 1) return res.redirect('/')



    try{
        const user = await getThisUserById(req, res)
        const posts = await getPosts(res, page)
        const lastPage = await getLastPage()
        return res.render('index', {user: user, posts: posts, banner: getRandomBanner(), page: page, lastPage: lastPage});
    }catch(e){
        return res.redirect('/login')
    }
  });

module.exports = router;