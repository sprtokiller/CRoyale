'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
// PRIVATE and PUBLIC key

var privateKEY = fs.readFileSync('D:/Documents/Visual Studio 2017/cookie/main-croyale-node/auth/private.key', 'utf8');

module.exports = {
    generateJWT: function (n, ind, r) {
        // PAYLOAD
        var payload = {
            theTruth: "Oranges>Mandarines",
            role: r,
            nick: n,
            uID: ind
        };
        // SIGNING OPTIONS
        var signOptions = {
            issuer: "CRoyale",                     //issuer
            audience: "http://croyale.net",        //audience
            algorithm: "HS256",                    //algorithm
            expiresIn: "24h"
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verifyJWT: function (token) {
        var verifyOptions = {
            issuer: "CRoyale",                     //issuer
            audience: "http://croyale.net",        //audience
            algorithm: ["HS256"],                  //algorithm
            expiresIn: "24h"
        };
        try {
            return jwt.verify(token, privateKEY, verifyOptions);
        } catch (err) {
            //console.log(err);
            return false;
        }
    },
    decodeJWT: function (token) {
        return jwt.decode(token, { complete: true });
    }
}; 