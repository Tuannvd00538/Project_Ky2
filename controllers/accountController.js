const admin = require('firebase-admin');
var request = require('request');
var microtime = require('microtime');
var crypto = require('crypto-js');
var db = admin.database();

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

exports.createAccount = async function(req, res) {
    var avatar = "";
    if (req.body.gender == 0) {
        avatar = "/assets/img/girl.jpg";
    } else {
        avatar = "/assets/img/man.png";
    }
    var id = microtime.now();
    db.ref("accounts/" + id).set({
        id: id,
		username: req.body.username,
		password: crypto.AES.encrypt(req.body.password, 'iSilent').toString(),
		email: req.body.email,
		fullname: req.body.fullname,
		gender: req.body.gender,
		createdAt: new Date().toLocaleDateString(),
		avatar: avatar,
		status: 1
    });
    let rs = await new Promise((resolve, reject) => {
		db.ref("accounts/" + id).on("value", function(snapshot, prevChildKey) {
            resolve(snapshot.val());
		});
    });
    if (rs) {
        res.send(rs);
    }
}