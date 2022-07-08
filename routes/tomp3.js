const {Router} = require('express');
const router = Router()
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtubesearchapi = require('youtube-search-api')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const axios = require('axios')



router.get('/:url', async (req, res) => {

    const {url} = req.params

    let id = ""
    let videoName = ""

    try{
        const videos = await youtubesearchapi.GetListByKeyword(`${url}`)
        id = videos.items[0].id
        videoName = videos.items[0].title.replace(/[\/\\.":*?<>{}]/g, '');
        console.log(videos)
      }catch(e){
        console.log(e)
        return res.send('ERROR XD')
      }

      try{
        await new Promise((resolve) => { // wait
            ytdl('http://www.youtube.com/watch?v=' + id, {filter: 'audioonly'})
            .pipe(fs.createWriteStream(`${__dirname}/../musica/${videoName}.mp3`))
            .on('close', () => {
              resolve();
            })
          })
      }catch(e){
        console.log(e)
      }

      var stat = fs.statSync(`${__dirname}/../musica/${videoName}.mp3`);
      var file = fs.readFileSync(`${__dirname}/../musica/${videoName}.mp3`, 'binary');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename=${videoName}.mp3`);
      res.write(file, 'binary');
      res.end();

      await delay(300000)

      fs.unlinkSync(`${__dirname}/../musica/${videoName}.mp3`)

})



module.exports = router