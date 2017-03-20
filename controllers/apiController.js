'use strict';

const request = require('request');

const configVars = require('../config/configVars.json');

const apiController = {

	// Update user with ?
	update	: function (req,res) {

		let devURL = configVars.devHost + '?access_token=' + configVars.devAccessToken;
		let updateURL = configVars.apiHost + configVars.apiEndpoint + '?access_token=' + configVars.devAccessToken;
		let updateBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>ContactService.findByEmail</methodName><params><param><value><string>' + configVars.privateKey + '</string></value></param><param><value><string>AUTHORKECK568@ACXIOM.COM</string></value></param><param><value><array><data><value><string>FirstName</string></value><value><string>Id</string></value></data></array></value></param></params></methodCall>'

		request ({
			method	: 'POST',
			url		: updateURL,
			headers	: {'Content-Type' : 'application/xml'},
			body	: updateBody
		}, function (err, resp, body) {
			
			if (err) {
				return console.log('Update Failed: ', err);
			}
			
			console.log(body);
		});

		res.sendStatus(200);
	}
};

module.exports = apiController;