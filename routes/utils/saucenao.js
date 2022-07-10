const {Router} = require('express')
const router = Router()
const axios = require('axios')
const { isAuthenticated } = require('../../controllers/authController')

router.get('/search', isAuthenticated, async (req, res) => {

    const {url} = req.query
    try{
    const saucenaoReq = await axios.get('https://saucenao.com/search.php?api_key=652c5ad302fda398fac1743fa92b98ea1ef8a365&db=999&output_type=2&testmode=1&numres=16&url=' + url)
    if(saucenaoReq.data.header.status < 0) return res.send({Error: 'LOL'})
    const saucenao = saucenaoReq.data.results.map(s => {
        return(
            {
                similarity: s.header.similarity,
                thumbnail: s.header.thumbnail,
                urls: s.data.ext_urls,
                creator: s.data.creator,
                material: s.data.material,
                characters: s.data.characters,
                source: s.data.source

            }
        )
    })
    return res.send(saucenao)
    }
    catch(e){
        console.log(e)
        return res.send({Error: 'LOL'})
    }
})

module.exports = router