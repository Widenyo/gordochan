require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fs = require('fs');
const getThisUserById = require("./functions/getters/getThisUserById");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


const app = require('express')();
const http = require('http').Server(app);
var io = require('socket.io')(http);


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


http.listen(process.env.PORT,  () => {
  async function destruccion(){
    const files = fs.readdirSync(`${__dirname}/musica`)
    for (const file of files) {
      if(file !== '.gitkeep')fs.unlink(`${__dirname}/musica/${file}`, err =>{
        if(err) console.log(err)
        else{
          console.log('Deleted ' + file)
        }
      })
    }
    await delay(300000)
    destruccion()
  }
  destruccion()
  console.log(`Listening on port ${process.env.PORT}`);
});


io.on('connection', (socket) => {

  // getThisUserById(req)

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});