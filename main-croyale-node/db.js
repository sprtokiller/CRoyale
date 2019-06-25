var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbname = "croyale_mongodb";
var url = "mongodb://localhost:27017";
var mongoOptions = {useNewUrlParser : true};

var state = {
    db : null
};

var connect = (cb) => {
    if(state.db)
    (cb);
    else{
        MongoClient.connect(url, mongoOptions, (err, client)=>{
            if (err)
            cb(err);
            else{
                state.db = client.db(dbname);
                cb();
            }
        })
    }
}

var getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

var getDB = () =>{
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};