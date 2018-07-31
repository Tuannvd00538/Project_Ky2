'use strict';
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

var accountRoute = require('./routes/accountRoute');
accountRoute(app);



// app.get('/create', async (req, res) => {
// 	db.ref("messages/group").on("value", function(snapshot) {
// 		res.send(snapshot.val());
// 	}, function (errorObject) {
// 		console.log("The read failed: " + errorObject.code);
// 	});
	
// 	res.send(crypto.AES.decrypt(rs.password, 'iSilent').toString(crypto.enc.Utf8));
// });

app.listen(8080, function () {
	console.log('Hello World!');
});