function twitter() {

	this.fetch = function(username, callback) {

		var http = require('http');

		var options = {
			host: 'api.twitter.com',
			path: '/1/users/show.json?screen_name='+username
		}

		http.request(options, function(response) {
			var str = '';

			response.on('data', function(chunk) {
				str += chunk;
			});

			response.on('end', function() {

				var tweeter = JSON.parse(str);

				if (callback === undefined) {
					return tweeter;
				} else {
					callback (
						{
							followers: tweeter.followers_count,
							following: tweeter.friends_count,
							tweet_count: tweeter.statuses_count,
							favourites: tweeter.favourites_count,
							listed: tweeter.listed_count,
							real_name: tweeter.name
						}
					);
				}

			});

		}).end();

	}

}

exports.twitter = twitter;