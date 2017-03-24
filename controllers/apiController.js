'use strict';

const request = require('request');

const configVars = require('../config/configVars.json');

let devURL = configVars.devHost + '?access_token=' + configVars.devAccessToken;
let apiURL = configVars.apiHost + configVars.apiEndpoint + '?access_token=' + configVars.devAccessToken;

const apiController = {

	// Retrieve ContactID for email address and add it to req.body
	retrieve	: function (req,res, next) {

		console.log(req.body);

		let searchBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>ContactService.findByEmail</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><string>' + req.body.email + '</string></value></param><param><value><array><data><value><string>FirstName</string></value><value><string>Id</string></value></data></array></value></param></params></methodCall>';

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
	// Use Opportunity (Lead) ID# to update StageID in Infusionsoft
	update 		: function (req,res) {

		let updateBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>DataService.update</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><string>Lead</string></value></param><param><value><int>' + req.body.opportunityIDNumber + '</int></value></param><param><value><struct><member><name>StageID</name><value><string>' + req.body.nextStageID + '</string></value></member></struct></value></param></params></methodCall>'

		// let updateBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>FunnelService.achieveGoal</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><string>or106</string></value></param><param><value><string>apiTest</string></value></param><param><value><int>' + req.body.contactIDNumber + '</int></value></param></params></methodCall>';

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
	},
	// Use ContacID to find the Opportunity Record ID we want
	find : function (req,res, next) {

		console.log(req.body);

		let findBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>DataService.query</methodName><params><param><value><string>' + configVars.regPrivateKey + '</string></value></param><param><value><string>Lead</string></value></param><param><value><int>5</int></value></param><param><value><int>0</int></value></param><param><value><struct><member><name>ContactID</name><value><string>' + req.body.contactIDNumber + '</string></value></member></struct></value></param><param><value><array><data><value><string>OpportunityTitle</string></value><value><string>ContactID</string></value><value><string>StageID</string></value><value><string>Id</string></value></data></array></value></param><param><value><string>StageID</string></value></param><param><value><boolean>1</boolean></value></param></params></methodCall>';

		request ({
			method	: 'POST',
			url		: apiURL,
			headers	: {'Content-Type' : 'application/xml'},
			body	: findBody
		}, function (err, resp, body) {
			
			if (err) {
				return console.log('Update Failed: ', err);
			}

			console.log(body);

			let opportunityIDNumber = body.split('Id</name><value><i4>')[1].split('</i4></value>')[0];

			console.log(opportunityIDNumber);

			req.body.opportunityIDNumber = parseInt(opportunityIDNumber);

			next();
		});
	}
};

module.exports = apiController;