const {Router} = require('express');
const router = Router()
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtubesearchapi = require('youtube-search-api')
const axios = require('axios')



router.get('/:url', async (req, res) => {

    const {url} = req.params

    let id = ""

    try{
        const videos = await youtubesearchapi.GetListByKeyword(`${url}`)
        id = videos.items[0].id
      }catch(e){
        console.log(e)
        return res.send('ERROR XD')
      }

      try{
        await new Promise((resolve) => { // wait
            ytdl('http://www.youtube.com/watch?v=' + id, {filter: 'audioonly'})
            .pipe(fs.createWriteStream(`${__dirname}/../musica/lol.mp3`))
            .on('close', () => {
              resolve();
            })
          })
      }catch(e){
        console.log(e)
        message.channel.send('ERROR XD')
      }

      var stat = fs.statSync(`${__dirname}/../musica/lol.mp3`);
      var file = fs.readFileSync(`${__dirname}/../musica/lol.mp3`, 'binary');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename=lol.mp3');
      res.write(file, 'binary');
      res.end();

})



module.exports = router