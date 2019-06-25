var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var db = require('./db');
var db_collection01 = "users";

app.get('/play',(req,res)=>{
    db.getDB().collection(db_collection01).find({}).toArray((err, documents)=>{
        if(err)
        console.log(err);
        else {
            console.log('gettuje data');
            res.json(documents);
        }
    }
});

db.connect((err)=>{
    if(err) {
        console.log('database nefunguje');
        process.exit(1);
        }
    else {
        app.listen(3000,()=>{
            console.log('pripojeno na portu 3000');
        });
    }
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);

module.exports = app;
