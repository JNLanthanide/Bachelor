const express = require('express');
const { json } = require('express');
const http = require('http')
const TangleInteractor = require('./IOTA/TangleInteractor.js');
const TokenHandler = require('./TokenHandler')
const bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');


require('body-parser-xml')(bodyParser);
const api = express();

// For receiving plain text
api.use(function(req, res, next){
	if (req.is('text/*')) {
	  req.text = '';
	  req.setEncoding('utf8');
	  req.on('data', function(chunk){ req.text += chunk });
	  req.on('end', next);
	} else {
	  next();
	}
  });

api.use(json());
api.use(bodyParser.xml());

api.listen(3000, () => {
	console.log('API up and running!');
});

api.get('/ResourceHandler.js', function(req, res) {
	res.sendFile(__dirname + '/ResourceHandler.js');
});

api.get('/', function(req, res) {
	res.sendFile(__dirname + '/FileExplorer.html');
});

api.post('/UploadPolicy', (req, res) => {
	console.log('UploadPolicy Request')
	TangleInteractor.publish({
		message: req.body,
		timestamp: (new Date()).toLocaleString()
	  }).then(root => {
		res.send(root)
		const data = JSON.stringify({
			policyRoot: root
		});
		const options = {
			hostname: '127.0.0.1',
			port: 3001,
			path: '/PostPolicy',
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': data.length
			}}
		const sendRootReq = http.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)
		
			res.on('data', d => {
			process.stdout.write(d)
			})})
		
			sendRootReq.on('error', error => {
			console.error(error)
		})
		console.log("Got here")
		sendRootReq.write(data)
		sendRootReq.end()
	}).catch(err => {
		res.send(err)
	})
});

api.post('/GrantAccess', (req, res) => {
	console.log('Got request')
	console.log(req.body)
	if (req.body.decision == 'Permit') {
		console.log("Permission Granted")
		const Filename = req.body.filename;
		TangleInteractor.CreateGrantAccessToken(Filename).then(token => {
			const data = JSON.stringify({
				messageId: token,
				filename: req.body.filename
			});

			const options = {
				hostname: '127.0.0.1',
				port: 3002,
				path: '/SendToken',
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  'Content-Length': data.length
				}}
			const sendTokenReq = http.request(options, res => {
				console.log(`statusCode: ${res.statusCode}`)
			
				res.on('data', d => {
				process.stdout.write(d)
				})})
			
				sendTokenReq.on('error', error => {
				console.error(error)
			})
			
			sendTokenReq.write(data)
			sendTokenReq.end()

		}).catch(err => {
			console.log(err)
		})
		res.send("Token Created")
	}
	else {
		res.send("Token could not be created");
	}
});


api.post('/SendToken', (req, res) => {
	try {
		TokenHandler.StoreToken(req.body);
		console.log('Token successfully stored');
	}
	catch(err) {
		console.log('Token could not be stored ' + err);
	}
});

api.post('/GetAccessToken', (req,res) => {
	console.log('Get access token request')
	const filename = req.text
	const messageId = TokenHandler.GetToken(filename);
	if (messageId != "No token found") {
		const options = {
			hostname: '127.0.0.1',
			port: 3000,
			path: `/GetAccess?filename=${filename}&messageId=${messageId}`,
			method: 'GET'
		}
		const getAccessReq = http.request(options, res => {
				const chunks = [];

				stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
				stream.on('error', (err) => reject(err));
				stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
			  
				fs.writeFile(__dirname + '/files/HeartJournal.txt', chunks, function(err) {
					if(err) {
						return console.log(err);
					}
					console.log("The file was saved!");
			}); 
			
		})
		getAccessReq.end()
	}
	else {
		console.log("No token found");
	}
	
})

api.get('/GetAccess', (req,res) => {
	if (TangleInteractor.VerifyGrantAccessToken(req.query.filename, req.query.messageId)) {
		var file = __dirname + '/files/HeartJournal.txt';

		var filename = path.basename(file);
	  
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', 'text/plain');
		
		var filestream = fs.createReadStream(file);
		filestream.on('open', function () {
			// This just pipes the read stream to the response object (which goes to the client)
			filestream.pipe(res);
		  });
		
		  // This catches any errors that happen while creating the readable stream (usually invalid names)
		  filestream.on('error', function(err) {
			res.end(err);
		  });
	}
	else {
		console.log("No token");
	}
})