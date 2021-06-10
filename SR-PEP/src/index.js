const express = require('express');
const { json } = require('express');
const TangleInteractor = require('./IOTA/TangleInteractor.js');
const api = express();

var accessToken = "";
api.use(json());
api.listen(3002, () => {
	console.log('API up and running!');
});

api.get('/', function(req, res) {
	res.sendFile(__dirname + '/FileExplorer.html');
});

api.post('/UploadPolicy', (req, res) => {
	console.log('Got request')
	console.log(req.body)
	TangleInteractor.publish(req.body).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(error)
	})
});

api.post('/GrantAccess', (req, res) => {
	console.log('Got request')
	console.log(req.body)
	if (req.body.decision == 'Permit') {
		console.log("Permission Granted")
		const Filename = req.body.filename;
		TangleInteractor.CreateGrantAccessToken(Filename);
	}
	else {
		console.log("Permission Denied")
	}
});