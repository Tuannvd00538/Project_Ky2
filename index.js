'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const admin = require('firebase-admin');

// const serviceAccount = require('./siinblog.json');

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: 'https://siinblog-bfg.firebaseio.com'
// });

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
// app.use(bodyParser.json());

var accountRoute = require('./routes/accountRoute');
accountRoute(app);

app.listen(8080, function () {
	console.log('Hello World!');
});