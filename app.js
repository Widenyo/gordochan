require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser')



const app = express();



//motor de plantillas
app.set('view engine', 'ejs')
app.enable('trust proxy')
//usar carpeta para static files
app.use("/public", express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser())


//router

app.use('/', require('./routes/router'))


app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
