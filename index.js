function GaCrawler(viewId, clientEmail, privateKey) {
	'use strict';
	var Lock = require('lock');
	var Q = require('q');
	var google = require('googleapis');
	var lock = new Lock();

	if (!viewId) viewId = process.env.GA_VIEWID;
	if (!clientEmail) clientEmail = process.env.GOOGLE_SERICES_EMAIL;
	if (!privateKey) privateKey = process.env.GCS_PRIVATE_KEY;

	var jwtClient;
	var analytics = google.analytics('v3');

	function auth(clientEmail, privateKey, cb) {
		if (!clientEmail || !privateKey)
			throw "clientEmail and privateKey not set";
		lock('auth', function(release) {
			try {
				var client = new google.auth.JWT(clientEmail, null, privateKey, ['https://www.googleapis.com/auth/analytics.readonly'], null);
				client.authorize(function (err, tokens) {
					release()();
					if (!err) jwtClient = client;
				});
			}
			catch(e) {
				release()();
			}
		});
	}

	function queryPageview(url, startdate, enddate, nTry) {
		var deferred = Q.defer();
		lock('auth', function(release){
			release()();
			if (!jwtClient)
				return deferred.reject('wrong access');

			analytics.data.ga.get({
				'auth': jwtClient,
				'ids': viewId,
				'metrics': 'ga:pageViews',
				'dimensions': 'ga:pagePath',
				'start-date': startdate,
				'end-date': enddate,
				'filters': 'ga:pagePath==' + url
			}, function (err, response) {
				if (err) {
					if (err.code === 403 && err.errors && err.errors[0] && err.errors[0].reason === 'userRateLimitExceeded') {
						// keep try again
						return queryPageview(url, startdate, enddate)
						.then(function(data){
							deferred.resolve(data);
						}).catch(function(data){
							deferred.reject(data);
						});
					}
					if (nTry === undefined) {
						// try to authenticate again
						return queryPageview(url, startdate, enddate, 1)
						.then(function(data){
							deferred.resolve(data);
						}).catch(function(data){
							deferred.reject(data);
						});
					} else {
						return deferred.reject(err);
					}
				}
				var pageViews = response.totalsForAllResults['ga:pageViews'];
				deferred.resolve(pageViews);
			});
		});
		return deferred.promise;
	}

	function queryUniqueVisitor(url, startdate, enddate, nTry) {
		var deferred = Q.defer();
		lock('auth', function(release){
			release()();
			if (!jwtClient)
				return deferred.reject('wrong access');

			analytics.data.ga.get({
				'auth': jwtClient,
				'ids': viewId,
				'metrics': 'ga:Users',
				'dimensions': 'ga:pagePath',
				'start-date': startdate,
				'end-date': enddate,
				'filters': 'ga:pagePath==' + url
			}, function (err, response) {
				if (err) {
					if (err.code === 403 && err.errors && err.errors[0] && err.errors[0].reason === 'userRateLimitExceeded') {
						// keep try again
						return queryUniqueVisitor(url, startdate, enddate)
						.then(function(data){
							deferred.resolve(data);
						}).catch(function(data){
							deferred.reject(data);
						});
					}
					if (nTry === undefined) {
						// try to authenticate again
						return queryUniqueVisitor(url, startdate, enddate, 1)
						.then(function(data){
							deferred.resolve(data);
						}).catch(function(data){
							deferred.reject(data);
						});
					} else {
						return deferred.reject(err);
					}
				}
					var uniqueUsers = response.totalsForAllResults['ga:Users'];
					deferred.resolve(uniqueUsers);
			});
		});
		return deferred.promise;
	}

	function queryPageviewAndUniqueVisitor(url, startdate, enddate, nTry) {
		var deferred = Q.defer();
		queryPageview(url, startdate, enddate).then(function(pageViews){
			queryUniqueVisitor(url, startdate, enddate).then(function(uniqueVisitors){
				deferred.resolve({totalPageviews: pageViews, totalUniqueUsers: uniqueVisitors});
			}).catch(function(err){
				deferred.reject(err);
			});
		}).catch(function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	}

	function batchQueryPageviewAndUniqueVisitor(urls, startdate, enddate, nTry) {
		
	}

	auth(clientEmail, privateKey);
	this.queryPageviewAndUniqueVisitors = queryPageviewAndUniqueVisitor;

	this.batchQueryPageviewAndUniqueVisitors = batchQueryPageviewAndUniqueVisitor;
}

exports.gaCrawler = GaCrawler;