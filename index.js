'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const admin = require('firebase-admin');

var serviceAccount = require("./iSilent.json");

const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '577731',
  key: '9090d5fdcdf5d65162ff',
  secret: '96ef6ce8e41763293cfb',
  cluster: 'ap1',
  encrypted: true
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://i-silent.firebaseio.com"
});

var db = admin.database();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
// app.use(bodyParser.json());

var accountRoute = require('./routes/accountRoute');
accountRoute(app);

app.get('/test', (req, res) => {
  return res.sendFile(__dirname + '/callvideo.html');
});

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  var presenceData = {
    user_id: Date.now()
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

app.listen(8080, function () {
  console.log('Hello World!');
});