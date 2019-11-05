console.clear();
/*
TODO: číslování guestů vypadlo, pravděpodobně problém s isRegistred
*/

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var session = require('express-session');
var cors = require('cors');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var croyaledbpath = "mongodb://localhost:27017/croyaledb";
var appurl = "http://localhost:4200";

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(croyaledbpath, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
var tokens = require('./auth/tokens');
var Game = require('./models/model.game');

PLAYERS_NEEDED = 6;
SECONDS_TO_START = 20;

//handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to: " + croyaledbpath);
  // we're connected!
  serverStartUp();
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

function debug() {
  console.log("==============");
  console.log("all Games[0]:");
  console.log(allGames[0].groups);
  console.log("All Clients:");
  console.log(allClients.length);
  console.log("==============");
}

function gameStart(gameID) {
  allGames[gameID].started = true;
  console.log("Game started");
}

function allGamesPushNew(shortname) { //TO-DO: memory saving, přepsat už ukončené hry - nezkazí old [i] u socket.GAME_ID a Array nebude nabobtnávat
  allGames.push(
    {
      starting: false,
      started: false,
      shortname: shortname,
      groups: [{
        players: []
      }]
    }
  )
}

function serverStartUp() {
  Game.getAllGames(function (data) {
    data.forEach(game => {
      allGamesPushNew(game.shortname)
    })
  })
}

function putToGame(socket, rI, sn) { //TODO, check if works, dbIndex odpovídá indexu z databáze

  allGames[rI].groups[0].players.push(socket); //visible group defaults to 0
  socket.ISPLACED = true;

  if (socket.PLAYER_registred != "true") {
    //console.log("setting guest name..."); 
    setGuestName();
  }

  if (allGames[rI].groups[0].players.length > PLAYERS_NEEDED) { //ve hře je víc players than treshold
    startGame();
  }

  //emit data to its respective socket
  if (io.sockets.adapter.rooms[sn]) {
    var roomSize = io.sockets.adapter.rooms[sn].length; //if a cheater is the first one in a given game, null error occurs
    socket.emit('aliveUpdate', roomSize);
    socket.to(sn).emit('aliveUpdate', roomSize);
  } else {
    console.log("Group gone");
  }

  createTileData(socket.GAME_id);

  //definition of inner functions
  function startGame() {
    allGames[rI].starting = true;
    console.log("Game starting");
    Game.startGame(gameIndex, function (success) {
      if (!success) {
        console.log("Error while starting the game");
      }
      else {
        console.log("Game succesfully started");
      }
    });
    for (let j = 0; j < allGames[rI].groups[0].players.length; j++) { //send everyone info that the game is starting
      allGames[rI].groups[0].players[j].emit('gameStarting', true);
      setTimeout(gameStart, SECONDS_TO_START * 1000, rI);
    }
  }
  function setGuestName() {
    var min = 1;
    var cheater = false;
    for (let i = 0; i < allGames[rI].groups[0].players.length; i++) { //iterate over players to find empty guest numbers

      if ((allGames[rI].groups[0].players[i].PLAYER_registred != "true") && (allGames[rI].groups[0].players[i].PLAYER_nickName != "")) {
        try {
          if (parseInt(allGames[rI].groups[0].players[i].PLAYER_nickName.slice(5)) == min) {
            min++;
          }
        } catch (error) {
          cheater = true;
        }
      }
    }
    if (!cheater) {
      var s = "0000" + min.toString();
      socket.PLAYER_nickName = "Guest" + s.substr(s.length - 3);
      //socket.disconnect(); //only testing purposes
    } else {
      socket.PLAYER_nickName = "Cheater";
      socket.disconnect(); //kicks out those who manipulated their name in socket
    }
  }

  console.log("Hra nalezena/vytvorena: {id: " + rI + ", sn: " + sn + ", pl: " + roomSize + " } pro hráče: " + socket.PLAYER_nickName);

};

function removeFromGame(socket, i) {
  var PVG = socket.PLAYER_visibleGroup;
  allGames[i].groups[PVG].players.splice(
    allGames[i].groups[PVG].players.indexOf(socket), 1
  );
};

function editInGame(socket, i) { //test
  var PVG = socket.PLAYER_visibleGroup;
  allGames[i].groups[PVG].players[
    allGames[i].groups[PVG].players.indexOf(socket)
  ].PLAYER_balance = 100;
};

function createTileData(i) {
  var gameGroups = allGames[i].groups;
  for (let i = 0; i < gameGroups.length; i++) { //iterate over groups in a game
    var tileData = [];
    for (let j = 0; j < gameGroups[i].players.length; j++) { //iterate over players in groups
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

//outdated
function createTileDataForOne(gameIndex, groupIndex, socket) {
  var gameGroup = allGames[gameIndex - 1].groups[groupIndex];
  var tileData = [];
  for (let j = 0; j < gameGroup.players.length; j++) { //iterate over players in groups
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
//outdated

io.on("connection", socket => {
  console.log('Nekdo se pripojil'); //rovnou zapsat do GameObjectu
  allClients.push(socket);
  Game.getGameForPlayer(socket.handshake.query.gameMode, socket.handshake.query.styleMode, function (error, data) {
    //data: {index_v_db, shortname_v_db, is_the_game_new} [returnIndex, shortname, isNew]
    if (error || !data) {
      console.log("Error while looking up the game");
    } else {
      if (data.isNew) allGamesPushNew(data.shortname);
      //setup socket player variables
      setupSocketPlayerDefaults(socket.handshake.query);

      socket.GAME_id = -1;
      socket.ISPLACED = false;
      socket.join(data.shortname); //joins correct socket room, so its easy to send mass emits

      setTimeout(function () { //actively handles the "lobby" part of the game, rooms take time to write sockets in them
        Object.keys(socket.rooms).forEach(function (room, idx) {
          if (idx != 0) {
            socket.gameRoom = room; //only default and then something like AA1 groups, so it sets it to our group
          }
        });
        //console.log(`gameRoom: ${socket.gameRoom}, returnIndex: ${data.returnIndex}, shortname: ${data.shortname}`);
        realIndex = allGames.findIndex(game => game.shortname == data.shortname); //finds game in allGames by shortname
        socket.GAME_id = realIndex;
        putToGame(socket, realIndex, socket.gameRoom);
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
    if (allClients[i].ISPLACED) {
      removeFromGame(socket, allClients[i].GAME_id);
      createTileData(allClients[i].GAME_id);
      if (io.sockets.adapter.rooms[allClients[i].gameRoom]) { //sends new data to group only if there are people in it
        socket.to(allClients[i].gameRoom).emit('aliveUpdate', io.sockets.adapter.rooms[allClients[i].gameRoom].length);
      }
    }
    allClients.splice(i, 1);
  })

  require('./routes/routerSocket.js')(socket, io);

  function setupSocketPlayerDefaults(query) {
    socket.PLAYER_nickName = query.username;
    socket.PLAYER_alive = true;
    socket.PLAYER_title = query.title;
    socket.PLAYER_skinID = query.skinID;
    socket.PLAYER_registred = query.registred;
    socket.PLAYER_visibleGroup = 0;
    socket.PLAYER_balance = 0;
    socket.PLAYER_clickWorth = 1;
    socket.PLAYER_hp = 100;
    socket.PLAYER_power = 0;
    socket.PLAYER_att = 0;
    socket.PLAYER_def = 0;
    socket.PLAYER_farm = 0;
    socket.PLAYER_offBranch = -1;
    socket.PLAYER_defBranch = -1;
    socket.PLAYER_upgrades = [];
  }
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
