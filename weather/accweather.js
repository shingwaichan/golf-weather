var querystring = require('querystring');
var http = require('http');
var url = require('url');

const host = 'dataservice.accuweather.com';
var PORT = 8080;
var apikey = 'ps2dpQTA7xdXdrL7go7jJbm2S3CpuqCu';

function getWeather(latlng, response) {
    var latClng = latlng.lat + ',' + latlng.lng;
    invokeEndpoint('/locations/v1/cities/geoposition/search', { 'q' : latClng }, response,
        function(data) {
            var responseObj = JSON.parse(data);
            var locKey = responseObj.Key;
            invokeEndpoint('/forecasts/v1/hourly/12hour/' + locKey, {}, response,
                function(data) {
                    response.write(data);
                    response.end();
                });
        });
}

function invokeEndpoint(endpoint, params, response, callback) {
    var hp = process.env.http_proxy;
    var myhost = host;
    var myport = 80;
    if (typeof hp !== 'undefined' && hp) {
        if (hp.startsWith("http://")) {
            myhost = hp.substring(7);
        }

        var ind = myhost.indexOf(":");
        if (ind !== -1) {
            myhost = myhost.substring(0, ind);
            myport = myhost.substring(ind + 1);
        }
        endpoint = 'http://' + host + endpoint;
    }
    var querydata = {
        'apikey': apikey
    }

    for (var k in params) {
        querydata[k] = params[k];
    }

    console.log(querydata);

    endpoint += '?' + querystring.stringify(querydata);
    var options = {
        host: myhost,
        port: myport,
        method: 'GET',
        path: endpoint
    };

    console.log(options);

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);
            callback(responseString);
        });
    });

    req.end();
}

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

// handle request
function handleRequest(request, response){
    response.setHeader('Content-Type', 'application/json');
    var queryObj = url.parse(request.url, true).query;
    var lat = queryObj.lat;
    var lng = queryObj.lng;
    if (typeof lat !== 'undefined' && lat &&
            typeof lng != 'undefined' && lng) {
        // e.g. lat = 37.37730499999999, lng = -121.8894033 
        getWeather({ 'lat': lat, 'lng': lng }, response);
    } else {
        response.write('{}');
        response.end();
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Let's start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
