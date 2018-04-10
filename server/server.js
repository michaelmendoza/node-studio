

var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3003;

// set up access to index.html
app.get('/', function(req, res) {
	console.log('Getting index.html');
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

app.get('/build/bundle.js', function(req, res) {
	res.sendFile(path.join(__dirname, '../build', 'bundle.js'));
});

/*
// set up the RESTful API, handler methods are defined in api.js
var api = require('./controllers/api.js');
app.get('/api', api.list);
app.get('/api/create', api.create);
app.get('/api/delete', api.delete);
*/

app.listen(port);
console.log("App with Data listening on port " + port);