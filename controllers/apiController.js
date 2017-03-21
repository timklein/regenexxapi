'use strict';

const request = require('request');

const configVars = require('../config/configVars.json');

let devURL = configVars.devHost + '?access_token=' + configVars.devAccessToken;
let apiURL = configVars.apiHost + configVars.apiEndpoint + '?access_token=' + configVars.devAccessToken;

const apiController = {

	// Update user with ?
	retrieve	: function (req,res, next) {

		console.log(req.body);

		let searchBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>ContactService.findByEmail</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><string>' + req.body.email + '</string></value></param><param><value><array><data><value><string>FirstName</string></value><value><string>Id</string></value></data></array></value></param></params></methodCall>'

		request ({
			method	: 'POST',
			url		: apiURL,
			headers	: {'Content-Type' : 'application/xml'},
			body	: searchBody
		}, function (err, resp, body) {
			
			if (err) {
				return console.log('Update Failed: ', err);
			}

			let contactIDNumber = body.split('<value><i4>')[1].split('</i4></value>')[0];

			req.body.contactIDNumber = parseInt(contactIDNumber);

			next();
		});
	},
	update 		: function (req,res) {

		let updateBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>FunnelService.achieveGoal</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><string>or106</string></value></param><param><value><string>apiTest</string></value></param><param><value><int>' + req.body.contactIDNumber + '</int></value></param></params></methodCall>'

		// let updateBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>ContactService.addToCampaign</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><int>' + req.body.contactIDNumber + '</int></value></param><param><value><int>2004</int></value></param></params></methodCall>'

		// let updateBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>ContactService.addToGroup</methodName><params><param><value><string>' + configVars.privateKey + '</string></value></param><param><value><int>' + req.body.contactIDNumber + '</int></value></param><param><value><int>279</int></value></param></params></methodCall>'

		request ({
			method	: 'POST',
			url		: apiURL,
			headers	: {'Content-Type' : 'application/xml'},
			body	: updateBody
		}, function (err, resp, body) {
			
			if (err) {
				return console.log('Update Failed: ', err);
			}
		
			console.log(body);			
			res.sendStatus(200);

		});
	}
};

module.exports = apiController;