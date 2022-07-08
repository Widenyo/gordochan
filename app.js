require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fs = require('fs')



const app = express();



//motor de plantillas
app.use(cors())
app.set('view engine', 'ejs')
//usar carpeta para static files
app.use("/public", express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser())


//router

app.use('/', require('./routes/router'))


app.listen(process.env.PORT, () => {
  const files = fs.readdirSync(`${__dirname}/musica`)
    for (const file of files) {
      if(file !== '.gitkeep')fs.unlinkSync(`${__dirname}/musica/${file}`)
    }
  console.log(`Listening on port ${process.env.PORT}`);
});
