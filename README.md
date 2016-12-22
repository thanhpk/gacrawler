[![npm version](https://badge.fury.io/js/gacrawler.svg)](https://badge.fury.io/js/gacrawler) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000?style=flat-square)]()

# gacrawler
*Crawl some basic data from Google Analytics*.

# Installing
```shell
npm install gacrawler --save
```

# Usage

## Single request
First, register you environment variables
```shell
$ export GOOGLE_SERICES_EMAIL=*****@developer.gserviceaccount.com
$ export GA_VIEWID=my-bucket
$ export GCS_PRIVATE_KEY=`cat path/to/google-services-private-key.pem`
```

Then, crawl data using `queryPageviewAndUniqueVisitors`
```js
var gaCrawler = require('gacrawler');
var crawler = new gaCrawler.gaCrawler();

var startdate = '2016-06-15';
var enddate = new Date();

crawler.queryPageviewAndUniqueVisitors('/', startdate, enddate).then(function(data){
	console.log(data); //output: { totalPageviews: '208873', totalUniqueUsers: '28157' }
}).catch(function(err){
	console.log(err);
});
```

If gaCrawler receives a RateLimited error from Google, it will retries until the correct data is returned.

Alternatively, you can set authentication manually using
```js
var gaCrawler = require('gacrawler');

var VIEWID = 'ga:106358211';
var clientEmail = '123-iecokshs@developer.gserviceaccount.com';
var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n\
123465798605697966965EpQIBAAKCAQEAqAqBYn1ANJfyoN91mqQ0VX+c57+j1W\n\
AFytVjQMm1IM3Axh+mowGLuAVnNCGIlByraJrL1U8Ch5sxfL1FzF6M0tMLzCxX+D\n\
yEd856F/BEQmFuK7/Lp98SMU9AeZW1NIlcL4rC1nqFgrceF52I+LKWIX69yw/Lmk\n\
ng7S2Qp7ir/pQvIcEJbgp7cTUPFlb51uRIuz+7YIHrOhAdA4BTUrnawY+rpOElsX\n\
146NWAfnj+r3luwMpZolXJ42LbBL6HaWRFElHtmAvffMGZzcYCXRZ09oRsLqrNKA\n\
JCevrIOIACvs31Lnknvyz+Ag+iHCrYdSg1VdXrbwwicP1/mQIDAQABAoIBAQCQyq\n\
CuaZqgvoMSWF/FgrwJxp+3a7URaLWBEmMbdcJGaBM9ZNrg/AcqhzRO/0BD5uMYSr\n\
tHfifPQdRQLlkpHGERHMyQtPSEb0ygYYU9Y8B+9F0hCHnuZxja7LLuBw/0CUh6pn\n\
eFIZ0ZMTPwNxmSsCNG+6N6RxartSXy1AUjjD+yLQAMmsZzLPbK4w15fA3ZyCX5UX\n\
98pOXYR9My6yT2Yr0rELo1jdeJvCoyGcbchEiqYUIYzbgmieenBDbJZTJB5R8M5W\n\
HLJ6lngU37kuGtQvkFH9qQA0kPmoUS9GxdK57ffFn+cAFV+uvO/T/e4ZBqKSNslq\n\
p+QUrQepAoGBANW0avQJn8fWShO6LrHouwm0+ivBQqtcm3vcdMFRNAde4xBJst+j\n\
jxI/w79t/uPlRL8rsmK9JSs4mbSjVcFD7u5npTUIYtqUE2ltTg3Xm0pCAuF+BnnU\n\
3nAHWYWt1WA3w/kvqQMbUgzKrQcjPgWqa1TnmB5NNOjCr5uNl4pWwbqXAoGBAMrh\n\
qg1CUjyaI/dEWIeSwbt48J8k+pxTukX9cfzePqSvVrbtEOa8OKq2xSHxsnjzib0B\n\
2DPa2xHJrjRyQBhs7mk9b6WTvmcz/B4KsRWt3puT2Ly4BFWrAPXtQAck/yCpjtOa\n\
99zqCjKMLq0gSsrk6Ixs1PAoGAWt59ATFOscqm/violIjx9y3+nsopGafVgVwAU1\n\
KUc7gSDA6YYC604oZdRz4azCdpp+8+SuTc3R39nFZHvui3ETlfSwGKhY4VecmcYK\n\
oPpFLcqExSQL7VUT4hrw2gQRx/2FXPTjFvOvY+CpjwCXFdVdAx3UPfMlz+dEjz0H\n\
nm1Z/bJsuEum4mz9wqWHhKUCgYEAtOL++1NmfyHvb0dAp5/xm3T5FOujhj4glsai\n\
GxMMR0kNx4sWxqKK46qRmPImbjC1Xg9kFDAxigUH+TsYokkVWPLqyzJejrqVc0Tp\n\
LQ/oQIR1izKtDuuNoGMn8zbJQhXrgj9pP05sSSUzdaW/p1P0cnq2NdsPFNqo5gIQ\n\
Z3ULy4ECgb/FLk5vIlwZ+8RxoVUkCeGRrpf7YEAgEl32/1lUKMDYNGnWg4j4oTCL\n\
vfjDa0D/JKd3RUQqgkMfm8oGk/u9uYxMkqqhbEMeJYaNlKBcTeyDLkbYr1w3TynB\n\
2+KhqQReUagY2HQixDJj4Pds99Jf5dIQAdpTvJo1BQR5fu5T/pScI6J=\n\
-----END RSA PRIVATE KEY-----';

var crawler = new new gaCrawler.gaCrawler(VIEWID, clientEmail, privateKey);

crawler.queryPageviewAndUniqueVisitors('/','2016-06-01', '2016-06-15').then(function(data){
	console.log(data); //output: { totalPageviews: '208873', totalUniqueUsers: '28157' }
}).catch(function(err){
	console.log(err);
});
```

gacrawler first will try to authorizate using clientEmail and privateKey,
you can get these information by creating new credential at
[https://console.developers.google.com/apis/credentials](https://console.developers.google.com/apis/credentials)

It also need your GA view id, to get it, login to Google Analytics,
go to menu `ADMIN`, you will see the `view setting` on the third column, 
click to the menu and it will show you your view id, example 
```
View ID
106358211
```
*Note, you have to add 'ga:' prefix into view id before pass it in the 
queryPageviewAndUniqueVisitors, it will look like query.queryPageviewAndUniqueVisitors('ga:106358211',..)*

## Batch query
You can do batch query by calling `batchQueryPageviewAndUniqueVisitors`, parameters is the same as 
`queryPageviewAndUniqueVisitors`, except for the first parameter, it instead takes an arrays of urls. 
```js
crawler.batchQueryPageviewAndUniqueVisitors(['/','/2','/3'], '2016-06-01', '2016-06-15').then(function(data){
	console.log(data); 
	//output: [
	//{ url: '/', totalPageviews: '203', totalUniqueUsers: '287' },
	//{ url: '/2', totalPageviews: '2873', totalUniqueUsers: '257' },
	//{ url: '/3', totalPageviews: '2083', totalUniqueUsers: '287' }
	//]
});
```

Output alway is an array contains the output which order is exactly the 
same as the input urls. 

If there is an error, the function will try to pass err in the array, so
 you don't have to add catch statement for batch query. For examples, an 
 output with error will look like:

```javascript
output: [
{ url: '/', totalPageviews: '203', totalUniqueUsers: '287' },
{ err: {message: "error"} },
{ url: '/3', totalPageviews: '2083', totalUniqueUsers: '287' }
]
```

# Test

```
npm test
```

# License

This software is licensed under the terms of [the MIT license](https://opensource.org/licenses/mit-license.php). See the LICENSE.md files.

# Questions

If you have any questions, please feel free to send me an email at `thanhpk@live.com`.
