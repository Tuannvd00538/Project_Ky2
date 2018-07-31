const admin = require('firebase-admin');
var request = require('request');
var microtime = require('microtime');
var crypto = require('crypto-js');
var db = admin.database();
var jwt = require('jsonwebtoken');

exports.getLogin = async function(req, res) {
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
		username: (req.body.username).toLowerCase(),
		password: crypto.AES.encrypt(req.body.password, 'iSilent').toString(),
		email: req.body.email,
		fullname: req.body.fullname,
        gender: req.body.gender,
        birthday: req.body.birthday,
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

exports.checkExistsUsername = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
		db.ref("accounts").orderByChild("username").equalTo((req.query.q).toLowerCase()).on("value", function(snapshot) {
            if (snapshot.val() != null || snapshot.val() != undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
		});
    });
    res.send(rs);
}

exports.login = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
		db.ref("accounts").orderByChild("username").equalTo((req.body.username).toLowerCase()).on("value", function(snapshot) {
            if (snapshot.val() != null || snapshot.val() != undefined) {
                var obj = snapshot.val();
                for (var key in obj) {
                    var value = obj[key];
                    var password = crypto.AES.decrypt(value.password, 'iSilent').toString(crypto.enc.Utf8);
                    if (value.status == 1) {
                        if (req.body.password == password) {
                            resolve({
                                id: value.id,
                                token: jwt.sign({ username: value.username, password: value.password, id: value.id }, 'RESTFULAPIs', { expiresIn: 1440 }),
                                username: value.username,
                                avatar: value.avatar,
                                fullname: value.fullname,
                                gender: value.gender,
                                birthday: value.birthday,
                                email: value.email
                            });   
                        } else {
                            resolve({
                                code: 401,
                                error: 'Tên đăng nhập hoặc mật khẩu không chính xác!'
                            });
                        }
                    } else if (value.status == 0) {
                        resolve({
                            code: 200,
                            error: 'Tài khoản của bạn đã bị khóa!'
                        });
                    }
                }
            } else {
                resolve({
                    code: 401,
                    error: 'Tên đăng nhập hoặc mật khẩu không chính xác!'
                });
            }
		});
    });
    res.json(rs);
}

exports.loginRequired = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({message: 'Token hết hạn hoặc không tồn tại!'});
    }
};