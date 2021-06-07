const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
var policyFetcher = require('./PolicyFetcher')
var policyEvaluator = require('./PolicyEvaluator')

const api = express();
//api.use(express.static(__dirname + '/public'));
api.use(bodyParser.json());

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
		if (policyEvaluator.EvaluatePolicy(result, req.body.Request.AccessSubject.Attribute.attributeId) == 'allow') {

		}
	})
});
