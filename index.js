(function(){
	'use strict';
	var Q = require('q');
	var google = require('googleapis.js');

	//var viewID = 'ga:106358211'; // Google Analytics view ID

	function auth(clientEmail, privateKey, cb)
	{
		var jwtClient = new google.auth.JWT(clientEmail, null, privateKey,  ['https://www.googleapis.com/auth/analytics.readonly'], null);
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				return cb(err, null);
      }
			return cb(jwtClient);
		});
	}

	function query(viewId, clientEmail, privateKey, url, startdate, enddate) {

		var deferred = Q.defer();
		auth(viewId, clientEmail, privateKey, function(err, jwtClient) {
			if (err)
				return deferred.reject(err);

			var analytics = google.analytics('v3');

			analytics.data.ga.get({
				'auth': jwtClient,
				'ids': viewId,
				'metrics': 'ga:pageViews',
				'dimensions': 'ga:pagePath',
				'start-date': startdate,
				'end-date': enddate,
				'filters': 'ga:pagePath=' + url
			}, function (err, response) {
				if (err) {
					return deferred.reject(err);
				}

				var pageViews = response.totalsForAllResults['ga:pageviews'];
				analytics.data.ga.get({
					'auth': jwtClient,
					'ids': viewId,
					'metrics': 'ga:pageViews',
					'dimensions': 'ga:pagePath',
					'start-date': startdate,
					'end-date': enddate,
					'filters': 'ga:pagePath=' + url
				}, function (err, response) {
					if (err) {
						return deferred.reject(err);
					}

					var uniqueUsers = response.totalsForAllResults['ga:users'];
					deferred.resolve({totalPageviews: pageViews, totalUniqueUsers: uniqueUsers});
				});
			});
		});
		return deferred.promise;
	}
})();