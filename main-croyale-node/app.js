var express = require('express');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var cors = require('cors');

var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var croyaledbpath = "mongodb://localhost:27017/croyaledb";
var db_Logins = "Logins";
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

// db.connect((err)=>{
//     if(err) { 
//         console.log('database nefunguje');
//         process.exit(1);
//         }
//     else {
//         app.listen(3000,()=>{
//             console.log('pripojeno na portu 3000');
//         });
//     }
// });
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
port = 3000
app.listen(port)
console.log(`Listening at http://localhost:${port}`)
module.exports = app;
