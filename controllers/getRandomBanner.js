
const fs = require('fs')
const bannerFolder = __dirname + '/../public/banners';


module.exports = () => {
    let items = fs.readdirSync(bannerFolder)
    items = items[Math.floor(Math.random()*items.length)]
    return items
}