const express = require('express');
const TanglePoster = require('./IOTA/TanglePoster.js')
const { json } = require('express');
const api = express();

api.use(json());
api.listen(3000, () => {
	console.log('API up and running!');
});

api.get('/', function(req, res) {
	res.sendFile(__dirname + '/FileExplorer.html');
  });

api.post('/UploadPolicy', (req, res) => {
	//console.log(req);
	console.log('Got request')
	console.log(req.body)
	TanglePoster.publish(req.body).then(result => {
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
	}
	else {
		console.log("Permission Denied")
	}
});
