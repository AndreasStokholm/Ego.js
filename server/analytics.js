function analytics() {

	this.fetch = function(username, password, profileId, callback) {

		var ga = require('googleanalytics');

		var GA = new ga.GA({user: username, password: password});
		GA.login(function() {

			var date = new Date();
			var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

			var options = {
				'ids': 'ga:'+profileId,
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
						'pageviews': pageviews,
						'visits':visits
					}
				);
			});

		})

	}

}

exports.analytics = analytics;