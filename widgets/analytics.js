function analytics() {

	this.registerWidget = function() {
		return {
			type: 'analytics',
			name: 'Google Analytics',
			color: 'e37b16',
			leftBadge: {
				field: 'visits',
				text: 'Visits'
			},
			rightBadge: {
				field: 'pageviews',
				text: 'Page views'
			},
			fetch: {
				username: 'text',
				password: 'password',
				profileId: 'number'
			}
		}
	}

	this.fetch = function(parameters, callback) {

		var ga = require('googleanalytics');

		try {
			var GA = new ga.GA({user: parameters.username, password: parameters.password});
			GA.login(function() {

				var date = new Date();
				var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

				var options = {
					'ids': 'ga:'+parameters.profileId,
					'start-date': dateString,
					'end-date': dateString,
					'dimensions': 'ga:pagePath',
					'metrics': 'ga:pageviews, ga:visits',
					'sort': '-ga:pagePath'
				}

				GA.get(options, function(err, entries) {
					var length = entries.length;
					var i = 1;
					var pageviews = 0;
					var visits = 0;

					while (i < length) {
						pageviews += entries[i].metrics[0]['ga:pageviews'];
						visits += entries[i].metrics[1]['ga:visits'];
						i++;
					}

					callback(
						{
							'error': 0,
							'pageviews': pageviews,
							'visits':visits
						}
					);
				});

			});
		} catch(e) {
			callback(
				{
					'error': 1
				}
			);
		}

	}

}

exports.widget = analytics;