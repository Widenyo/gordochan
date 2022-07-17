require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fs = require('fs');
const getThisUserById = require("./functions/getters/getThisUserById");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const {parse} = require('cookie')


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


io.on('connection', async (socket) => {

  const cookie = parse((socket.handshake.headers.cookie || ""))
  if(!cookie.jwt) return socket.disconnect()
  const cookies = {cookies: {jwt: cookie.jwt}}

  let user = {}
  try{
  user = await getThisUserById(cookies)
  }catch(e){
    console.log(e)
    return socket.disconnect()
  }

  io.emit('send-message', `Asoplata: hola ${user.user}`);

  socket.on('chat message', (msg) => {
    io.emit('send-message', `${user.user}: ${msg}`);
  });
});