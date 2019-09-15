var express = require('express');
var router = express.Router();
var Login = require('../models/model.login');
var User = require('../models/model.user');
var tokens = require('../auth/tokens');

// GET route for reading data
//router.get('/', function (req, res, next) {
//  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
//});

router.post('/login', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  if (req.body.username &&
    req.body.password &&
    req.body.externalType &&
    req.body.externalID) {
    //jdeme overovat
    Login.authenticate(req.body.externalType, req.body.externalID, req.body.username, req.body.password, function (error, login) {
      if (error || !login) {
        res.status(401);
        var err = new Error();
        err.reason = "Wrong username or password.";
        return res.send(err);
      } else {
        User.getBasicUserInfoBy_id(login.relatedUser_index, function (error2, user) {
          if (error2 || !user) {
            res.status(401);
            var err2 = new Error();
            err2.reason = "Account does not exist.";
            return res.send(err2);
          } else { //every login, create a different jwt token from _id hash SUCCESS
            user.username = req.body.username;
            user.token = tokens.generateJWT(user.username, user.index, user.role);
            return res.send(user);
          }
        })
      }
    });
  } else {
    res.status(400);
    var err3 = new Error();
    err3.reason = "Invalid JSON data. Go away.";
    return res.send(err3)
  }
})

router.post('/register', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  if (req.body.username &&
    req.body.password &&
    req.body.externalType &&
    req.body.externalID) {
    //jdeme registrovat
    Login.checkMateExists(req.body.externalType, req.body.externalID, req.body.username, function (exists) {
      if (exists) {
        console.log("Registration unsuccesfull - user exists.")
        res.status(401); 
        var err = new Error();
        err.reason = "Registration unsuccesfull - user exists.";
        return res.send(err);
      } else { //can register now
        Login.register(req.body.externalType, req.body.externalID, req.body.username, req.body.password, function (isErr, error){
          if (isErr){
            console.log("Registration unsuccesfull.")
            res.status(401); 
            var err = new Error();
            err.reason = "Registration unsuccesfull.";
            return res.send(err);
          } else {
            console.log("now login");
            //hurray, now login
          }
        })
      }
    });
  } else {
    res.status(400);
    var err3 = new Error();
    err3.reason = "Invalid JSON data. Go away.";
    return res.send(err3)
  }
})

// GET route after registering
//router.get('/profile', function (req, res, next) {
//  Login.findById(req.session.userId)
//    .exec(function (error, user) {
//      if (error) {
//        return next(error);
//      } else {
//        if (user === null) {
//          var err = new Error('Not authorized! Go back!');
//          err.status = 400;
//          return next(err);
//        } else {
//          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
//        }
//      }
//    });
//});

// POST for checking jwt while login and rerouting
router.post('/check', function (req, res, next) {
  // console.log(req.body);
  if (req.body.userToken) {
    try {
      if (tokens.decodeJWT(req.body.userToken))
        if (tokens.verifyJWT(req.body.userToken, "CRoyale", "http://croyale.net")) {
          //     console.log("Success as User");
          //    console.log("sending OK");
          return res.send({ response: "OK" });
        } else {
          //     console.log("sending /login1");
          return res.send({ response: "/login" });
        }
    } catch (error) {
      //    console.log("sending /login2");
      return res.send({ response: "/login" });
    }
  }
  // console.log("sending /login3");
  return res.send({ response: "/login" });
});

module.exports = router;