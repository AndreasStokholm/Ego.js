var http = require('http'),
	fs = require('fs'),
	querystring = require('querystring'),
	mime = require('mime');

// Find all widgets
var widgets = [],
	widgetRoutes = [];

fs.readdirSync('./widgets').forEach(function(file) {
	var widget = require('./widgets/' + file).widget;
	var w = new widget();
	var registeredWidget = w.registerWidget();
	registeredWidget.instance = w;
	widgets.push(registeredWidget);
	widgetRoutes.push('/'+registeredWidget.type);
});

http.createServer(function(request, response) {

	if (request.method === 'GET') {

		var urlParts = request.url.split('?');
		var parameters = querystring.parse(urlParts[1]);

		// Check if we have a widget for the url
		if (widgetRoutes.indexOf(urlParts[0]) > -1 && urlParts[0] != '/') {

			widgets.forEach(function(widget) {
				if (urlParts[0] == '/'+widget.type) {
					response.writeHead(200, {'Content-Type': 'application/json'});
					try {
						widget.instance.fetch(parameters, function(data) {
							response.end(JSON.stringify(data));
						});
					} catch(e) {
						response.end(JSON.stringify({'error': 1}));
					}
				}
			});

		} else { // If we didn't have a widget, serve the site instead.

			if (request.url == '/') {
				request.url = '/index.htm';
			}

			fs.readFile('./client'+request.url, 'UTF-8', function(err, data) {

				if (err) {
					response.writeHead(404, {'Content-Type': 'text/html'});
					response.end('<h1>404</h1>No data at endpoint (Not found).');
				}

				response.writeHead(200, {'Content-Type': mime.lookup('./client'+request.url)});
				response.end(data);
			});
		}

	} else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end('Not found.');
	}

}).listen(8080);