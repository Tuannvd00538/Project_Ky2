'use strict';
// ChatHub with Love
const express = require('express');
const bodyParser = require('body-parser');

const admin = require('firebase-admin');

var serviceAccount = require("./iSilent.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://i-silent.firebaseio.com"
});

var db = admin.database();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
// app.use(bodyParser.json());

var ChatHubRoute = require('./routes/ChatHubRoute');
ChatHubRoute(app);

app.listen(8080, function () {
  console.log('ChatHub © 2018 Power by ChatHub Corp');
});