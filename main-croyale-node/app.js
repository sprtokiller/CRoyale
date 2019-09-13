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

PLAYERS_NEEDED = 6;

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
  socket.disconnect('unauthorized');
  //return next(new Error('authentication error'));
});
var allGames = [];
var allClients = []; //Store all sockets so we can properly access them when disconnected

 function gameStart(gameID) {
  allGames[gameID].started = true;
  console.log("Game started");
 }

function putToGame(socket, gameIndex, sn) { 
  if (gameIndex > allGames.length) { //vytvori novou hru
    allGames.push(
      {
        starting: false,
        started: false,
        shortname: sn,
        groups: [{
          players: [socket]
        }
        ]
      }
    )
  } else {
    allGames[gameIndex - 1].groups[socket.PLAYER_visibleGroup].players.push(socket);
  }
  console.log("(added): ");
  console.log(allGames);
  if (allGames[gameIndex - 1].groups[socket.PLAYER_visibleGroup].players.length > PLAYERS_NEEDED) {
    allGames[gameIndex - 1].starting = true;
    console.log("Game starting");
    Game.startGame(gameIndex,  function (success) {
      if (!success) {
        console.log("Error while starting the game");
      } else {
        console.log("Game succesfully started");
      }
    })
    for (let j = 0; j < allGames[gameIndex - 1].groups[0].players.length; j++) { //send everyone info that the game is starting
      allGames[gameIndex - 1].groups[0].players[j].emit('gameStarting', true);
      setTimeout(gameStart, 1500, (gameIndex - 1));
    }
  }

 // 
 // setTimeout(myFunc, 1500, '1');
 // setTimeout(myFunc, 500, '2');
 // setTimeout(myFunc, 2500, '3');
};

function removeFromGame(socket, gameIndex) {
  if (gameIndex <= allGames.length) { //hra existuje
    //console.log(allGames[gameIndex].players);
    var PVG = socket.PLAYER_visibleGroup;
    allGames[gameIndex - 1].groups[PVG].players.splice(
      allGames[gameIndex - 1].groups[PVG].players.indexOf(socket), 1
    );
  }
  console.log("(deleted): ");
  console.log(allGames);
};

function editInGame(socket, gameIndex) { //test
  if (gameIndex <= allGames.length) { //hra existuje
    var PVG = socket.PLAYER_visibleGroup;
    allGames[gameIndex - 1].groups[PVG].players[
      allGames[gameIndex - 1].groups[PVG].players.indexOf(socket)
    ].PLAYER_money = 100;
  }
  console.log("(edited): ");
  console.log(allGames);
};

function createTileData(gameIndex) {
  var gameGroups = allGames[gameIndex - 1].groups;

  for (let i = 0; i < gameGroups.length; i++) { //iterate over groups in a game
    var tileData = [];
    for (let j = 0; j < gameGroups[i].players.length; j++) { //iterate over players in groups
      // console.log("i = " + i + ", j = " + j);
      var myPlayer = gameGroups[i].players[j];

      tileData.push({
        nick: myPlayer.PLAYER_nickName,
        alive: myPlayer.PLAYER_alive,
        hp: myPlayer.PLAYER_hp,
        power: myPlayer.PLAYER_power,
        def: myPlayer.PLAYER_def,
        att: myPlayer.PLAYER_att,
        farm: myPlayer.PLAYER_farm,
        color: "",
        avatar_id: myPlayer.PLAYER_skinID
      })
    }
    for (let j = 0; j < gameGroups[i].players.length; j++) { //send everyone their data
      gameGroups[i].players[j].emit('tileDataUpdate', tileData);
    }
  }
};

function createTileDataForOne(gameIndex, groupIndex, socket) {
  var gameGroup = allGames[gameIndex - 1].groups[groupIndex];
  var tileData = [];
  for (let j = 0; j < gameGroup.players.length; j++) { //iterate over players in groups
    // console.log("i = " + i + ", j = " + j);
    var myPlayer = gameGroup.players[j];

    tileData.push({
      nick: myPlayer.PLAYER_nickName,
      alive: myPlayer.PLAYER_alive,
      hp: myPlayer.PLAYER_hp,
      power: myPlayer.PLAYER_power,
      def: myPlayer.PLAYER_def,
      att: myPlayer.PLAYER_att,
      farm: myPlayer.PLAYER_farm,
      color: "",
      avatar_id: myPlayer.PLAYER_skinID
    })
  }
      socket.emit('tileDataUpdate', tileData);  
};

io.on("connection", socket => {
  console.log('Nekdo se pripojil'); //rovnou zapsat do GameObjectu
  allClients.push(socket);
  Game.getGameForPlayer(socket.handshake.query.gameMode, socket.handshake.query.styleMode, function (error, data) {
    if (error || !data) {
      console.log("Error while looking up the game");
    } else {
      //setup socket player variables
      socket.PLAYER_nickName = socket.handshake.query.username;
      socket.PLAYER_alive = true;
      socket.PLAYER_title = socket.handshake.query.title;
      socket.PLAYER_skinID = socket.handshake.query.skinID;
      socket.PLAYER_registred = socket.handshake.query.registred;
      socket.PLAYER_visibleGroup = 0;
      socket.PLAYER_money = 0;
      socket.PLAYER_hp = 100;
      socket.PLAYER_power = 0;
      socket.PLAYER_att = 0;
      socket.PLAYER_def = 0;
      socket.PLAYER_farm = 0;
      socket.PLAYER_offBranch = -1;
      socket.PLAYER_defBranch = -1;
      socket.PLAYER_upgrades = [];
      socket.GAME_id = data.returnIndex;
      //setup socket player variables

      socket.join(data.shortname); //joins correct room
      
      
      setTimeout(function () { //actively handles the "lobby" part of the game, rooms take time to write sockets in them
        Object.keys(socket.rooms).forEach(function (room, idx) {
          if (idx != 0) {
            socket.gameRoom = room; //only default and then something like AA1 groups, so it sets it to our group
          }
        });
        putToGame(socket, data.returnIndex, socket.gameRoom);

      //guest names
      var min = 1;
      for (let i = 0; i < allGames[data.returnIndex - 1].groups[0].players.length; i++) { //iterate over players to find empty guest numbers
        if ((allGames[data.returnIndex - 1].groups[0].players[i].PLAYER_registred) && (allGames[data.returnIndex - 1].groups[0].players[i].PLAYER_nickName != "")){
          //je guest a ma uz i cislo
          if (parseInt(allGames[data.returnIndex - 1].groups[0].players[i].PLAYER_nickName.slice(5)) == min){ //TODO Try?
           min++;
          }
        } 
      }
      var s = "0000" + min.toString();
      socket.PLAYER_nickName = "Guest" + s.substr(s.length - 3);
      console.log(socket.PLAYER_nickName);

        //editInGame(socket, data.returnIndex);
        //createData(socket.gameRoom);
        console.log("Hra nalezena/vytvorena: {id: " + data.returnIndex + ", sn: " + data.shortname + ", pl: " + io.sockets.adapter.rooms[data.shortname].length + " }");

        socket.emit('aliveUpdate', io.sockets.adapter.rooms[data.shortname].length);
        socket.to(data.shortname).emit('aliveUpdate', io.sockets.adapter.rooms[data.shortname].length);

        createTileData(socket.GAME_id);
        //emit data to its respective socket
      }, 3);

    }
  })

  socket.on("getGameData", isOnInit => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    console.log('Nekdo chce data')
    console.log(socket.GAME_id);
    console.log(socket.PLAYER_visibleGroup);
    //createTileDataForOne(socket.GAME_id, socket.PLAYER_visibleGroup, socket);
  });

  socket.on('disconnect', function () {
    var i = allClients.indexOf(socket);
    removeFromGame(socket, allClients[i].GAME_id);
    createTileData(allClients[i].GAME_id);
    //console.log("Nekdo se odpojil (index: " + i + ") a jeho roomka byla: " + allClients[i].gameRoom ); //TODO, list of sockets, read from there and then delete 
    if (io.sockets.adapter.rooms[allClients[i].gameRoom]) { //sends new data to group only if there are people in it
      socket.to(allClients[i].gameRoom).emit('aliveUpdate', io.sockets.adapter.rooms[allClients[i].gameRoom].length);
    }
    allClients.splice(i, 1);
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
http.listen(httpPort, function () {
  console.log(`Socket.io @ : http://localhost:${httpPort}`);
});
appPort = 3000;
app.listen(appPort, function () {
  console.log(`App listens : http://localhost:${appPort}`);
});
console.log(`Front-end is: ${appurl}`);

module.exports = app;
