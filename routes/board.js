const auth = require('../controllers/authController')
const getRandomBanner = require('../controllers/getRandomBanner')
const {Router} = require('express');
const getPosts = require('../functions/getters/getPosts')
const getLastPage = require('../functions/getters/getLastPage')
const getThisUserById = require('../functions/getters/getThisUserById');
const { boardExists } = require('../controllers/boardController');
const getBoardId = require('../functions/getters/getBoardId');
const getBoard = require('../functions/getters/getBoard');
const router = Router()





router.get("/:board", auth.isAuthenticated, boardExists, async (req, res) => {

    

    try{

        const short = req.params.board

        const user = await getThisUserById(req)

        const posts = await getPosts(res, 1, short, user)
        const board = await getBoard(short)
        const lastPage = await getLastPage(board.id)

        return res.render('board', {user: user, posts: posts, banner: getRandomBanner(), page: 1, lastPage: lastPage, boardId: board.id, short: short, boardName: board.name});
    }catch(e){
        console.log(e)
        return res.redirect('/login')
    }
  });

router.get("/:board/page/:page", auth.isAuthenticated, boardExists, async (req, res) => {

    const page = parseInt(req.params.page)
    const short = req.params.board
    const board = await getBoard(short)

    if(page <= 0 || !(parseInt(page))) return res.redirect('https://www.youtube.com/watch?v=03SIKP4sVfY')
    if(page === 1) return res.redirect('/boards/' + short + '/')



    try{
        const user = await getThisUserById(req)
        const posts = await getPosts(res, page, short, user)
        const lastPage = await getLastPage(board.id)
        return res.render('board', {user: user, posts: posts, banner: getRandomBanner(), page: page, lastPage: lastPage, boardId: board.id, short: short, boardName: board.name});
    }catch(e){
        console.log(e)
        return res.redirect('/login')
    }
});

module.exports = router;