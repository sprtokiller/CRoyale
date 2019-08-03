var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var croyaledbpath = "mongodb://localhost:27017/croyaledb";
var appurl = "http://localhost:4200";
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(croyaledbpath);
var db = mongoose.connection;
var tokens = require('./auth/tokens');
var Game = require('./models/model.game');
var Config = require('./models/model.config');
//handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to: " + croyaledbpath);
  // we're connected!
});

io.use((socket, next) => { //socket ověřování tokenu, když token, pak join as user, jinak dát temp id v průběhu hry
  //console.log("Query: ", socket.handshake.query);
  let token = socket.handshake.query.token;
  //console.log(tokens.decodeJWT(token));
  if (token == "guest") { 
    return next();
  } else
  if (tokens.verifyJWT(token, "CRoyale", "http://croyale.net")) {
    return next();
  }
  console.log("Login probably expired");
  return next(new Error('authentication error'));
});

io.on("connection", socket => {
  console.log('Nekdo se pripojil'); //rovnou zapsat do GameObjectu

     Game.getGameForPlayer(socket.handshake.query.gameMode, socket.handshake.query.styleMode, function (error, data) {
      if (error || !data) {
        console.log("Error while looking up the game");
        } else { 
          //setup socket player variables
          socket.PLAYER_nickName = socket.handshake.query.nickname, 
          socket.PLAYER_title = socket.handshake.query.title,
          socket.PLAYER_skinID = socket.handshake.query.skinID,
          socket.PLAYER_registred = socket.handshake.query.registred,
          socket.PLAYER_visibleGroup = 0,
          socket.PLAYER_money = 0,
          socket.PLAYER_att = 0,
          socket.PLAYER_def = 0,
          socket.PLAYER_farm = 0, 
          socket.PLAYER_offBranch = -1,
          socket.PLAYER_defBranch = -1,
          socket.PLAYER_upgrades = []
          //setup socket player variables
          socket.join(data.shortname);
          setTimeout(function () {
            socket.to(data.shortname).emit('aliveUpdate', io.sockets.adapter.rooms[data.shortname].length );
            Object.keys(socket.rooms).forEach(function(room, idx) {
              if(idx!=0){
                  socket.gameRoom = room;
              }
           }); 
           console.log("Hra nalezena/vytvorena: {id: " + data.returnIndex + ", sn: " + data.shortname + ", pl: " + io.sockets.adapter.rooms[data.shortname].length + " }");
           socket.emit('aliveUpdate', io.sockets.adapter.rooms[data.shortname].length );
        }, 5); 

        }
     })  

  require('./routes/routerSocket.js')(socket, io);
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// include routes
var routes = require('./routes/router');
app.use('/', routes);

httpPort = 3001;
http.listen(httpPort, function(){
  console.log(`Socket.io @ : http://localhost:${httpPort}`);
});
appPort = 3000;
app.listen(appPort, function(){
  console.log(`App listens : http://localhost:${appPort}`);
});
console.log(`Front-end is: ${appurl}`);

module.exports = app;
