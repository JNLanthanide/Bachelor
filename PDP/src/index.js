const express = require('express');
const cors = require('cors')
const http = require('http')
const policyFetcher = require('./PolicyFetcher')
const policyEvaluator = require('./PolicyEvaluator');
const { json } = require('express');

const api = express();
//api.use(express.static(__dirname + '/public'));
api.use(json());

api.use(cors());

api.get('/', function(req, res) {
	res.sendFile(__dirname + '/Authentication.html');
  });

api.listen(3001, () => {
	console.log('API up and running!');
});

api.post('/EvaluatePolicy', (req, res) => {
	console.log('Got request')
	policyFetcher.GetPolicyStub().then(result => {
		const Filename = req.query.Filename;
		if (policyEvaluator.EvaluatePolicy(result, req.body.Request.AccessSubject.Attribute.attributeId) == 'allow') {
			const PEP = req.query.PEP
			console.log(PEP);
			const data = JSON.stringify({
				decision: 'Permit',
				filename: Filename
			});

			const options = {
				hostname: PEP,
				port: 3000,
				path: '/GrantAccess',
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  'Content-Length': data.length
				}}

			const permitReq = http.request(options, res => {
				console.log(`statusCode: ${res.statusCode}`)
			
				res.on('data', d => {
				process.stdout.write(d)
				})})
			
			permitReq.on('error', error => {
				console.error(error)
			})
			
			permitReq.write(data)
			permitReq.end()
		}
	})
});
