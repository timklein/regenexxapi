'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const apiController = require('./controllers/apiController.js');

const app = express();

app.use(bodyParser.urlencoded({ extended:false }));

app.get('/incoming', apiController.retrieve, apiController.update);

const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});