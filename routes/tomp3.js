const {Router} = require('express');
const router = Router()
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtubesearchapi = require('youtube-search-api')
const getRandomBanner = require('../controllers/getRandomBanner');
const getThisUserById = require('../functions/getters/getThisUserById');
const { isAuthenticated } = require('../controllers/authController');
const db = require('../database/db');
const contentDisposition = require('content-disposition')

function validator(str) {
  return !/[^\u0000-\u00ff]/g.test(str);
}



router.get('/', isAuthenticated, async (req, res) => {

  const user = await getThisUserById(req)

  const recentVideos = await db.query('SELECT *, recent_downloads.id AS id FROM recent_downloads JOIN users ON users.id = user_id ORDER BY recent_downloads.id DESC' ,[user.id])

  return res.render('tomp3', {user: user, banner: getRandomBanner(), recent: recentVideos});
})

router.get('/download/:id', isAuthenticated, async (req, res) => {

    const {id} = req.params
    const {title} = req.query

    console.log(title)

    if(!title) return res.send(title + ' lol') 

    const mp3 = title.replace(/[\/\\.":*?<>{}|]/g, '') + '.mp3'

    

    
        try{
        await new Promise((resolve, reject) => { // wait
            ytdl('http://www.youtube.com/watch?v=' + id, {filter: 'audioonly'})
            .on('error', e => reject(e))
            .pipe(fs.createWriteStream(`${__dirname}/../musica/${mp3}`))
            .on('close', () => {
              resolve();
            })
          })
        }catch(e){
          console.log(e)
          return res.send('ERROR XD')
        }

      const user = await getThisUserById(req)

      await db.query('INSERT INTO recent_downloads SET ?', {user_id: user.id, anon: false, filename: mp3})


      var stat = fs.statSync(`${__dirname}/../musica/${mp3}`);
      var file = fs.readFileSync(`${__dirname}/../musica/${mp3}`, 'binary');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'audio/mpeg');
      !validator(mp3) ?
      res.setHeader('Content-Disposition', `attachment; filename=${contentDisposition(mp3)}`):
      res.setHeader('Content-Disposition', `attachment; filename=\"${mp3}\"`);
      res.write(file, 'binary');
      res.end();

      

})

router.get('/videosearch/:name', isAuthenticated, async (req, res) => {
  const {name} = req.params

    try{
        const videosReq = await youtubesearchapi.GetListByKeyword(`${name}`)
        const videos = videosReq.items.map(v => {
          return({
            title: v.title,
            channel: v.channelTitle,
            id: v.id,
            thumbnail: v.thumbnail.thumbnails[0].url,
            length: v.length && v.length.simpleText
          })
        })
        res.send(videos)
      }catch(e){
        console.log(e)
        return res.send('ERROR XD')
      }
})



module.exports = router