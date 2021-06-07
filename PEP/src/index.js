const express = require('express');
const TanglePoster = require('./IOTA/TanglePoster.js')
const bodyParser = require('body-parser');
const { json } = require('express');

const api = express();
//api.use(express.static(__dirname + '/public'));
//api.use(bodyParser.json());


api.listen(3000, () => {
	console.log('API up and running!');
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


api.get('/GetAccess', (req, res) => {
	console.log('Got request')
	console.log(req.body)

});

//api.post('/add', (req, res) => {
//	console.log(req.body);
//	res.send('It works!');
//});
