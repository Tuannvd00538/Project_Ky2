const admin = require('firebase-admin');
var request = require('request');
var microtime = require('microtime');
var crypto = require('crypto-js');
var db = admin.database();
var uuid = require('uuid');
var nJwt = require('njwt');

exports.getLogin = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/login.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
}

exports.createAccount = async function (req, res) {
    var avatar = "";
    if (req.body.gender == 2) {
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
        db.ref("accounts/" + id).on("value", function (snapshot, prevChildKey) {
            resolve(snapshot.val());
        });
    });
    if (rs) {
        res.send(rs);
    }
}

exports.checkExistsUsername = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("accounts").orderByChild("username").equalTo((req.query.q).toLowerCase()).on("value", function (snapshot) {
            if (snapshot.val() != null || snapshot.val() != undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
    res.send(rs);
}

exports.login = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("accounts").orderByChild("username").equalTo((req.body.username).toLowerCase()).on("value", function (snapshot) {
            if (snapshot.val() != null || snapshot.val() != undefined) {
                var obj = snapshot.val();
                for (var key in obj) {
                    var value = obj[key];
                    var password = crypto.AES.decrypt(value.password, 'iSilent').toString(crypto.enc.Utf8);
                    if (value.status == 1) {
                        if (req.body.password == password) {
                            var claims = {
                                "username": value.username,
                                "id": value.id
                            }
                            var jwt = nJwt.create(claims, "secret", "HS256");
                            var token = jwt.compact();
                            resolve({
                                id: value.id,
                                token: token,
                                username: value.username,
                                avatar: value.avatar,
                                fullname: value.fullname,
                                gender: value.gender,
                                birthday: value.birthday,
                                email: value.email,
                                chatlist: value.chatlist
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

exports.loginRequired = function (req, res, next) {
    var token = req.headers.authorization;
    nJwt.verify(token, "secret", function (err, verifiedJwt) {
        if (err) {
            res.status(401).json({ message: 'Token hết hạn hoặc không tồn tại!' });
        } else {
            next();
        }
    });
};

exports.getSign = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/register.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
}

exports.saveMessage = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("messages" + req.body.idChat + "/messages/" + microtime.now()).set({
            id: req.body.id,
            msg: req.body.msg,
            createdAt: Date.now()
        });
        resolve(true);
    });
    res.send(rs);
}

exports.getAvatar = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("accounts/" + req.params.id).on("value", function (snapshot) {
            resolve(snapshot.val());
        });
    });
    try {
        res.send(rs.avatar);
    } catch (error) {
        console.log('Error Avatar: ', error);
    }
}

exports.getInfo = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("accounts/" + req.params.id).on("value", function (snapshot) {
            resolve(snapshot.val());
        });
    });
    let data = {
        avatar: rs.avatar,
        username: rs.username,
        fullname: rs.fullname,
        gender: rs.gender,
        email: rs.email,
        birthday: rs.birthday
    }
    res.send(data);
}

exports.getMessage = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/message.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
};

exports.listMessage = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("messages/" + req.params.mode + "/" + req.params.id + "/info").on("value", function (info) {
            if (req.params.mode == 'single') {
                if (req.query.me == undefined) {
                    resolve('Đừng phá nữa my fen :))');
                } else if (info.val().key != req.query.me) {
                    db.ref("accounts/" + info.val().key).on("value", function (account) {
                        db.ref("messages/" + req.params.mode + "/" + req.params.id + "/messages").limitToLast(1).on("value", function (lastMsg) {
                            let data = {
                                avatar: account.val().avatar,
                                fullname: account.val().fullname,
                                chat: lastMsg.val()
                            }
                            resolve(data);
                        });
                    });
                } else if (info.val().client != req.query.me) {
                    db.ref("accounts/" + info.val().client).on("value", function (account) {
                        db.ref("messages/" + req.params.mode + "/" + req.params.id + "/messages").limitToLast(1).on("value", function (lastMsg) {
                            let data = {
                                avatar: account.val().avatar,
                                fullname: account.val().fullname,
                                chat: lastMsg.val()
                            }
                            resolve(data);
                        });
                    });
                }
            } else if (req.params.mode == 'group') {
                resolve('group!');
            }
        });
    });
    res.send(rs);
}

exports.createMessage = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/new.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
}

exports.createGrMessage = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/group.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
}

exports.searchUser = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("accounts").orderByChild("id").equalTo(parseInt(req.params.id)).on("value", function (snapshot) {
            resolve(snapshot.val());
        });
    });
    if (rs != null) {
        for (var key in rs) {
            if (rs.hasOwnProperty(key)) {
                let data = {
                    avatar: rs[key].avatar,
                    birthday: rs[key].birthday,
                    createdAt: rs[key].createdAt,
                    email: rs[key].email,
                    fullname: rs[key].fullname,
                    gender: rs[key].gender,
                    id: rs[key].id,
                    username: rs[key].username
                }
                res.send(data);
            }
        }
    } else {
        res.json({
            code: 404,
            message: 'Không có kết quả tìm kiếm!'
        });
    }
}

exports.sendMsg = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        var id = microtime.now();
        db.ref("messages/" + req.body.mode + "/" + id + "/info").set({
            client: req.body.idClient,
            key: req.body.idKey
        });
        db.ref("messages/" + req.body.mode + "/" + id + "/messages/" + microtime.now()).set({
            id: req.body.idKey,
            msg: req.body.msg,
            createdAt: Date.now()
        });
        db.ref("accounts/" + req.body.idKey + "/chatlist").update({
            [id]: req.body.mode
        });
        db.ref("accounts/" + req.body.idClient + "/chatlist").update({
            [id]: req.body.mode
        });
        resolve(id);
    });
    res.send('/' + req.body.mode + '/' + rs);
}

exports.sendMsgGr = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        var id = microtime.now();
        db.ref("messages/" + req.body.mode + "/" + id + "/info").set({
            avatar: req.body.avatar,
            listUser: req.body.listUser,
            name: req.body.name
        });
        db.ref("messages/" + req.body.mode + "/" + id + "/messages/" + microtime.now()).set({
            id: req.body.idKey,
            msg: req.body.msg,
            createdAt: Date.now()
        });
        db.ref("accounts/" + req.body.idKey + "/chatlist").update({
            [id]: req.body.mode
        });
        db.ref("accounts/" + req.body.idClient + "/chatlist").update({
            [id]: req.body.mode
        });
        resolve(id);
    });
    res.send('/' + req.body.mode + '/' + rs);
}

exports.about = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/about.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
};

exports.download = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/platform.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
};

exports.setting = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/setting.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
};

exports.help = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        request('http://localhost:8080/help.html', (error, response, body) => {
            resolve(body);
        });
    });
    if (rs) {
        res.send(rs);
    }
};

exports.saveAvt = async function (req, res) {
    let rs = await new Promise((resolve, reject) => {
        db.ref("/accounts/" + req.params.id + "/avatar").set(req.body.url);
        resolve('Update avatar success!');
    });
    res.send(req.body.url);
}

exports.sendMsgGr = async function(req, res) {
    let rs = await new Promise((resolve, reject) => {
        var id = microtime.now();
        db.ref("messages/" + req.body.mode + "/" + id + "/info").set({
            avatar: req.body.avt,
            name: req.body.name
        });
        db.ref("messages/" + req.body.mode + "/" + id + "/messages/" + microtime.now()).set({
            id: req.body.idKey,
            msg: req.body.msg,
            createdAt: Date.now()
        });
        var lus = JSON.parse(req.body.listUser);
        for (const i in lus) {
            db.ref("messages/" + req.body.mode + "/" + id + "/info/listUser").update({
                [lus[i]]: req.body.mode
            });
            db.ref("accounts/" + lus[i] + "/chatlist").update({
                [id]: req.body.mode
            });
        }
        db.ref("accounts/" + req.body.idKey + "/chatlist").update({
            [id]: req.body.mode
        });
        resolve(id);
    });
    res.send('/' + req.body.mode + '/' + rs);
}