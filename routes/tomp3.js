const {Router} = require('express');
const router = Router()
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtubesearchapi = require('youtube-search-api')
const getRandomBanner = require('../controllers/getRandomBanner');
const getThisUserById = require('../functions/getters/getThisUserById');
const { isAuthenticated } = require('../controllers/authController');



router.get('/', isAuthenticated, async (req, res) => {

  const user = await getThisUserById(req)

  return res.render('tomp3', {user: user, banner: getRandomBanner()});
})

router.get('/download/:id', isAuthenticated, async (req, res) => {

    const {id} = req.params
    const {title} = req.query

    

    
        try{
        await new Promise((resolve, reject) => { // wait
            ytdl('http://www.youtube.com/watch?v=' + id, {filter: 'audioonly'})
            .on('error', e => reject(e))
            .pipe(fs.createWriteStream(`${__dirname}/../musica/${title}.mp3`))
            .on('close', () => {
              resolve();
            })
          })
        }catch(e){
          console.log(e)
          return res.send('ERROR XD')
        }

      var stat = fs.statSync(`${__dirname}/../musica/${title}.mp3`);
      var file = fs.readFileSync(`${__dirname}/../musica/${title}.mp3`, 'binary');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename=${title}.mp3`);
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
            parsedTitle: v.title.replace(/[\/\\.":*?<>{}]/g, ''),
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