'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
// PRIVATE and PUBLIC key

var privateKEY = fs.readFileSync('D:/Documents/Visual Studio 2017/cookie/main-croyale-node/auth/private.key', 'utf8');
var publicKEY = fs.readFileSync('D:/Documents/Visual Studio 2017/cookie/main-croyale-node/auth/public.key', 'utf8');

module.exports = {
    generateJWT: function (i, s, a, ind, r) {
        // PAYLOAD
        var payload = {
            theTruth: "Oranges>Mandarines",
            role: r,
            uID : ind
        };
        // SIGNING OPTIONS
        var signOptions = {
            issuer: i,        //issuer
            subject: s,        //subject
            audience: a,        //audience
            algorithm: "HS256",   //algorithm
            expiresIn: "24h"
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verifyJWT: function (token, i, s, a) {
        var verifyOptions  = {
            issuer: i,        //issuer
            subject: s,        //subject
            audience: a,        //audience, later compare with incoming JWT
            algorithm: ["HS256"]   //algorithm
        };
        try{
            return jwt.verify(token, publicKEY, verifyOptions);
          }catch (err){
            return false;
          }
    },
    decodeJWT: function (token) {
        return jwt.decode(token, {complete: true});
    }
};