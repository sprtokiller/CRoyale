var express = require('express');
var router = express.Router();
var Login = require('../models/model.login');

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});


router.post('/login', function (req, res, next) {
  //  console.log(req);
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    if (req.body.username &&
        req.body.password &&
        req.body.externalType &&
        req.body.externalID){
            console.log("je platny json");
        //jdeme overovat
        Login.authenticate(req.body.externalType, req.body.externalID, req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
              var err = new Error('Wrong username or password.');
              err.status = 401;
              return next(err);
            } else {
                console.log("Přihlášeno!"); 
              req.session.userId = user._id;
              return res.send('signed in') 
            }
          });
    } else {
        return res.send('Hello there, from the server. U sux')
    }
})


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("Passwords do not match.");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    Login.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    Login.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  Login.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;