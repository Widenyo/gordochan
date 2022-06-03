
const fs = require('fs')
const bannerFolder = __dirname + '/../public/banners';
let banners = fs.readdir(bannerFolder, (err, files) => {
    return files
  });

let jorge = 16


module.exports = () => {
    let items = fs.readdirSync(bannerFolder)
    items = items[Math.floor(Math.random()*items.length)]
    return items
}