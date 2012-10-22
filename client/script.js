// First of all, we work with local storage
function datastore() {

	this.set = function(key, value) {

		try {
			localStorage.setItem(key, value);
			return true;
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				var empty_local = confirm('For some reason I have no more space on your device to save data. Wanna reset the app and start over?');

				if (empty_local) {
					// Clear all localStorage for this domain.
					localStorage.clear();

					// Try and save this again.
					save_locally(key, value);
				}
			} else {
				return false;
			}
		}
	}

	this.get = function(key) {

		try {
			return localStorage.getItem(key);
		} catch (e) {
			return false;
		}

	}

	this.remove = function(key) {

		if (confirm('Do you really want to delete this widget?')) {
			return localStorage.removeItem(key);
		} else {
			return false;
		}

	}

}


// Widgets
function widgets() {

	this.getWidgets = function() {

		var d = new datastore();

		// First we get all registered widgets from the local storage.
		var widgets = d.get('widgets');

		if (widgets === null) {

			// Tell user how to add widgets
			$('body').append(
				'<div class="noWidgets">Add a widget by clicking add widget in the lower right corner.</div>'
			);

		} else {

			widgets = widgets.split(',');

			var i = 0;
			while (i < widgets.length) {
				// Draw widget
				this.draw(widgets[i].trim());
				i++;
			}

		}

	}

	this.draw = function(widgetId) {

		// TODO: Make use of a template engine.

		var d = new datastore();

		var widget = JSON.parse(d.get(widgetId));
		if (widget !== null) {
			if (widget.type == 'twitter') {

				this.getData('twitter', widget, function(data) {
					$('body').append(
						'<div class="widget twitter">'
							+'<div class="widgetIdentifier"><span>Twitter</span><span class="widgetName">'+data.real_name+'</div>'
							+'<span class="rightMetric">Followers <span class="metric">'+data.followers+'</span></span>'+
						'</div>'
						);
				});

			} else if (widget.type == 'analytics') {

				this.getData('analytics', widget, function(data) {
					$('body').append(
					'<div class="widget analytics">'
						+'<div class="widgetIdentifier"><span>Google Analytics</span><span class="widgetName">'+widget.tracker_name+'</div>'
						+'<span class="leftMetric"><span class="metric">'+data.visits+'</span> Visits</span>'
						+'<span class="rightMetric">Page views <span class="metric">'+data.pageviews+'</span></span>'+
					'</div>'
					);
				});

			}
		}

		return true;

	}

	this.getData = function(type, data, callback) {

		$.get(location.href+type, data, function(data) {
			callback(data);
		}, 'json');

	}

	this.addNew = function(object) {

		var d = new datastore();

		var widgetPool = d.get('widgets');
		if (widgetPool === null) {
			widgetPool = '';
		}

		// Get widget id
		var idArray = widgetPool.split(',');
		var widgetId = idArray.length;

		// Save widget
		d.set(widgetId, JSON.stringify(object));

		// Register widget in pool
		widgetPool += widgetId+',';
		d.set('widgets', widgetPool);

	}

}

$(document).ready(function() {
	var w = new widgets();
	var d = new datastore();
	w.getWidgets();

	$('#addWidget').click(function(e) {
		e.preventDefault();
		$('#addWidgetBox').show();
	});

	$('#closeAddWidgetBox').click(function(e) {
		e.preventDefault();
		$('#addWidgetBox').hide();
	});

	$('#type').change(function() {
		if ($('#type').find(':selected').val() == 'twitter') {
			$('#twitter_type').show();
			$('#analytics_type').hide();
		}

		if ($('#type').find(':selected').val() == 'analytics') {
			$('#twitter_type').hide();
			$('#analytics_type').show();
		}
	});

	$('#addWidgetSubmit').click(function() {
		if ($('#type').find(':selected').val() == 'twitter') {
			w.addNew({type: 'twitter', username: $('#twitter_username').val()});
		}

		if ($('#type').find(':selected').val() == 'analytics') {
			w.addNew({type: 'analytics', username: $('#analytics_username').val(), password: $('#analytics_password').val(), profileId: $('#analytics_profileid').val(), tracker_name: $('#analytics_trackername').val()});
		}

		$('#closeAddWidgetBox').click();
		$('.widget').remove();
		w.getWidgets();
	});

});
