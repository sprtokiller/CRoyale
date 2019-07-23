var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var cors = require('cors');

var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var croyaledbpath = "mongodb://localhost:27017/croyaledb";
var appurl = "http://localhost:4200";
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(croyaledbpath);
var db = mongoose.connection;

//handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to: " + croyaledbpath);
  // we're connected!
});

io.on("connection", socket => {
  console.log('Nekdo se pripojil');
  let previousId;
  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on("getGameData", gameId, playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("sendClicks", gameId, playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("sendBuy", gameId, playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("addDoc", doc => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit("documents", Object.keys(documents));
    socket.emit("document", doc);
  });

  socket.on("editDoc", doc => {
    documents[doc.id] = doc;
    socket.to(doc.id).emit("document", doc);
  });

  io.emit("documents", Object.keys(documents));
});

app.use(cors()); //CORS errors fixed here
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// include routes
var routes = require('./routes/router');
app.use('/', routes);


//app.use(cookieParser())

// // serve static files from template
// app.use(express.static(__dirname + '/templateLogReg'));


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// // define as the last app.use callback
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message);
// });
httpPort = 3001;
appPort = 3000;
http.listen(httpPort);
app.listen(appPort);
console.log(`Socket.io @ : http://localhost:${httpPort}`);
console.log(`App listens : http://localhost:${appPort}`);
console.log(`Front-end is: ${appurl}`);

module.exports = app;
