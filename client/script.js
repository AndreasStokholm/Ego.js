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

	this.clear = function() {

		if (confirm('Are you sure you want to clear all widgets?')) {
			localStorage.clear();
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

		if ($('.noWidgets').length !== 0) {
			$('.noWidgets').remove();
		}

		$('#closeAddWidgetBox').click();
		$('.widget').remove();
		w.getWidgets();
	});

	$('#resetAllSettings').click(function() {
		var d = new datastore();
		d.clear();
		$('#closeSettingsBox').click();
	});

	$('#settings').click(function(e) {
		e.preventDefault();
		$('#settingsBox').show();
	});

	$('#closeSettingsBox').click(function(e) {
		e.preventDefault();
		$('#settingsBox').hide();
	});

	setTimeout(function() {

		var p = new PNGlib(90, 90, 256);
		var background = p.color(0, 0, 0, 0);

		var widgetAmt = d.get('widgets').split(',').length;
		var widgetHeight = 90 / (widgetAmt - 1);

		var i = 1;
		var indexStart = 0;
		while (i < widgetAmt) {

			console.log(indexStart);

			var color;
			widget = JSON.parse(d.get(i));

			if (widget.type == 'twitter') {
				color = p.color(0x32, 0x6f, 0xa8);
			} else if (widget.type == 'analytics') {
				color = p.color(0xe3, 0x7b, 0x16);
			}

			for (var j = 0; j < 90; j++) {
				for (var k = 0; k < widgetHeight; k++) {
					p.buffer[p.index(j, k + (indexStart > 0 ? indexStart : 1))] = color;
				}
			}

			i++;
			indexStart = (i - 1) * widgetHeight;
		}

		$('#iconContainer').attr('href', 'data:image/png;base64,'+p.getBase64());
		//document.write('<img src="data:image/png;base64,'+p.getBase64()+'">');
	}, 500);

});




// Libraries

/**
* A handy class to calculate color values.
*
* @version 1.0
* @author Robert Eisele <robert@xarg.org>
* @copyright Copyright (c) 2010, Robert Eisele
* @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
* @license http://www.opensource.org/licenses/bsd-license.php BSD License
*
*/

(function() {

	// helper functions for that ctx
	function write(buffer, offs) {
		for (var i = 2; i < arguments.length; i++) {
			for (var j = 0; j < arguments[i].length; j++) {
				buffer[offs++] = arguments[i].charAt(j);
			}
		}
	}

	function byte2(w) {
		return String.fromCharCode((w >> 8) & 255, w & 255);
	}

	function byte4(w) {
		return String.fromCharCode((w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w & 255);
	}

	function byte2lsb(w) {
		return String.fromCharCode(w & 255, (w >> 8) & 255);
	}

	window.PNGlib = function(width,height,depth) {

		this.width   = width;
		this.height  = height;
		this.depth   = depth;

		// pixel data and row filter identifier size
		this.pix_size = height * (width + 1);

		// deflate header, pix_size, block headers, adler32 checksum
		this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

		// offsets and sizes of Png chunks
		this.ihdr_offs = 0;									// IHDR offset and size
		this.ihdr_size = 4 + 4 + 13 + 4;
		this.plte_offs = this.ihdr_offs + this.ihdr_size;	// PLTE offset and size
		this.plte_size = 4 + 4 + 3 * depth + 4;
		this.trns_offs = this.plte_offs + this.plte_size;	// tRNS offset and size
		this.trns_size = 4 + 4 + depth + 4;
		this.idat_offs = this.trns_offs + this.trns_size;	// IDAT offset and size
		this.idat_size = 4 + 4 + this.data_size + 4;
		this.iend_offs = this.idat_offs + this.idat_size;	// IEND offset and size
		this.iend_size = 4 + 4 + 4;
		this.buffer_size  = this.iend_offs + this.iend_size;	// total PNG size

		this.buffer  = new Array();
		this.palette = new Object();
		this.pindex  = 0;

		var _crc32 = new Array();

		// initialize buffer with zero bytes
		for (var i = 0; i < this.buffer_size; i++) {
			this.buffer[i] = "\x00";
		}

		// initialize non-zero elements
		write(this.buffer, this.ihdr_offs, byte4(this.ihdr_size - 12), 'IHDR', byte4(width), byte4(height), "\x08\x03");
		write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), 'PLTE');
		write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), 'tRNS');
		write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), 'IDAT');
		write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), 'IEND');

		// initialize deflate header
		var header = ((8 + (7 << 4)) << 8) | (3 << 6);
		header+= 31 - (header % 31);

		write(this.buffer, this.idat_offs + 8, byte2(header));

		// initialize deflate block headers
		for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {
			var size, bits;
			if (i + 0xffff < this.pix_size) {
				size = 0xffff;
				bits = "\x00";
			} else {
				size = this.pix_size - (i << 16) - i;
				bits = "\x01";
			}
			write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, byte2lsb(size), byte2lsb(~size));
		}

		/* Create crc32 lookup table */
		for (var i = 0; i < 256; i++) {
			var c = i;
			for (var j = 0; j < 8; j++) {
				if (c & 1) {
					c = -306674912 ^ ((c >> 1) & 0x7fffffff);
				} else {
					c = (c >> 1) & 0x7fffffff;
				}
			}
			_crc32[i] = c;
		}

		// compute the index into a png for a given pixel
		this.index = function(x,y) {
			var i = y * (this.width + 1) + x + 1;
			var j = this.idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;
			return j;
		}

		// convert a color and build up the palette
		this.color = function(red, green, blue, alpha) {

			alpha = alpha >= 0 ? alpha : 255;
			var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

			if (typeof this.palette[color] == "undefined") {
				if (this.pindex == this.depth) return "\x00";

				var ndx = this.plte_offs + 8 + 3 * this.pindex;

				this.buffer[ndx + 0] = String.fromCharCode(red);
				this.buffer[ndx + 1] = String.fromCharCode(green);
				this.buffer[ndx + 2] = String.fromCharCode(blue);
				this.buffer[this.trns_offs+8+this.pindex] = String.fromCharCode(alpha);

				this.palette[color] = String.fromCharCode(this.pindex++);
			}
			return this.palette[color];
		}

		// output a PNG string, Base64 encoded
		this.getBase64 = function() {

			var s = this.getDump();

			var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var c1, c2, c3, e1, e2, e3, e4;
			var l = s.length;
			var i = 0;
			var r = "";

			do {
				c1 = s.charCodeAt(i);
				e1 = c1 >> 2;
				c2 = s.charCodeAt(i+1);
				e2 = ((c1 & 3) << 4) | (c2 >> 4);
				c3 = s.charCodeAt(i+2);
				if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
				if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
				r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
			} while ((i+= 3) < l);
			return r;
		}

		// output a PNG string
		this.getDump = function() {

			// compute adler32 of output pixels + row filter bytes
			var BASE = 65521; /* largest prime smaller than 65536 */
			var NMAX = 5552;  /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
			var s1 = 1;
			var s2 = 0;
			var n = NMAX;

			for (var y = 0; y < this.height; y++) {
				for (var x = -1; x < this.width; x++) {
					s1+= this.buffer[this.index(x, y)].charCodeAt(0);
					s2+= s1;
					if ((n-= 1) == 0) {
						s1%= BASE;
						s2%= BASE;
						n = NMAX;
					}
				}
			}
			s1%= BASE;
			s2%= BASE;
			write(this.buffer, this.idat_offs + this.idat_size - 8, byte4((s2 << 16) | s1));

			// compute crc32 of the PNG chunks
			function crc32(png, offs, size) {
				var crc = -1;
				for (var i = 4; i < size-4; i += 1) {
					crc = _crc32[(crc ^ png[offs+i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);
				}
				write(png, offs+size-4, byte4(crc ^ -1));
			}

			crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
			crc32(this.buffer, this.plte_offs, this.plte_size);
			crc32(this.buffer, this.trns_offs, this.trns_size);
			crc32(this.buffer, this.idat_offs, this.idat_size);
			crc32(this.buffer, this.iend_offs, this.iend_size);

			// convert PNG to string
			return "\211PNG\r\n\032\n"+this.buffer.join('');
		}
	}

})();
