const admin = require('firebase-admin');
var request = require('request');
var microtime = require('microtime');

exports.login = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/login.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
}