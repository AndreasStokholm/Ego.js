function twitter() {

	this.registerWidget = function() {
		return {
			type: 'twitter',
			name: 'Twitter',
			color: '326fa8',
			leftBadge: {},
			rightBadge: {
				field: 'followers',
				text: 'Followers'
			},
			fetch: {
				username: 'username'
			}
		}
	}


	this.fetch = function(parameters, callback) {

		var http = require('http');

		var options = {
			host: 'api.twitter.com',
			path: '/1/users/show.json?screen_name='+parameters.username
		}

		try {

			http.request(options, function(response) {
				var str = '';

				response.on('data', function(chunk) {
					str += chunk;
				});

				response.on('end', function() {

					var tweeter = JSON.parse(str);

					callback(
						{
							'error': 0,
							'followers': tweeter.followers_count,
							'following': tweeter.friends_count,
							'tweet_count': tweeter.statuses_count,
							'favourites': tweeter.favourites_count,
							'listed': tweeter.listed_count,
							'real_name': tweeter.name
						}
					);

				});

			}).end();

		} catch(e) {
			callback(
				{
					'error': 1
				}
			);
		}

	}

}

exports.widget = twitter;