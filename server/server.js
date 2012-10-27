var t = require('./twitter').twitter,
	twitter = new t(),
	a = require('./analytics').analytics,
	analytics = new a(),
	http = require('http'),
	fs = require('fs'),
	querystring = require('querystring');

http.createServer(function(request, response) {

	// TODO: Refactor, and make create a module system so it's easy to add more services. - Use require.js for the modules.

	if (request.method === 'GET') {

		var urlParts = request.url.split('?');
		var parameters = querystring.parse(urlParts[1]);

		if (urlParts[0] == '/twitter') {

			response.writeHead(200, {'Content-Type': 'application/json'});
			twitter.fetch(parameters.username, function(data) {
				response.end(JSON.stringify(data));
			});
		} else if (urlParts[0] == '/analytics') {
			response.writeHead(200, {'Content-Type': 'application/json'});
			analytics.fetch(parameters.username, parameters.password, parameters.profileId, function(data) {
				response.end(JSON.stringify(data));
			});
		} else {
			// Determine file we're looking for.
			// TODO: This should be made smarter.
			var file = 'index.htm';
			var content_type = 'text/html';
			if (request.url == '/script.js') {
				file = 'script.js';
				content_type = 'text/javascript';
			} else if (request.url == '/jquery.min.js') {
				file = 'jquery.min.js';
				content_type = 'text/javascript';
			} else if (request.url == '/style.css') {
				file = 'style.css';
				content_type = 'text/css';
			}

			fs.readFile(__dirname+'/..'+'/client/'+file, 'UTF-8', function(err, data) {
				response.writeHead(200, {'Content-Type': content_type});
				response.end(data);
			});
		}

	} else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end('Not found.');
	}

}).listen(8080);