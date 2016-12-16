var querystring = require('querystring');
var http = require('http');
var url = require('url');
var fs = require('fs');

const host = 'dataservice.accuweather.com';
const PORT = 8888;
const apikey = '';   // put your accuweather api key here

// load hash
var contents = fs.readFileSync('mockdata.txt', 'utf-8').toString();
var lines = contents.split(/\r?\n/);

var mockHash = {};
var odd = true;
var key;

lines.forEach(function(line) {
    if (odd) {
        key = line;
    } else {
        mockHash[key] = line;
    }
    odd = !odd;
});

var hp = process.env.http_proxy;
console.log('http_proxy = ' + hp);

function getWeather(latlng, callback) {
    var latClng = latlng.lat + ',' + latlng.lng;
    var mockValue = mockHash[latClng];
    if (typeof mockValue !== 'undefined' && mockValue) {
        callback(mockValue);
        console.log("use mock data");
        return;
    }

    invokeEndpoint('/locations/v1/cities/geoposition/search', { 'q' : latClng },
        function(data) {
            var responseObj = JSON.parse(data);
            var locKey = responseObj.Key;
            invokeEndpoint('/forecasts/v1/hourly/12hour/' + locKey, {}, callback);
        });
}

function invokeEndpoint(endpoint, params, callback) {
    var myhost = host;
    var myport = 80;
    if (typeof hp !== 'undefined' && hp) {
        if (hp.startsWith("http://")) {
            myhost = hp.substring(7);
        }

        var ind = myhost.indexOf(":");
        if (ind !== -1) {
            myport = myhost.substring(ind + 1);
            myhost = myhost.substring(0, ind);
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

    endpoint += '?' + querystring.stringify(querydata) + '&details=true';
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
            //console.log(responseString);
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
        // e.g. lat=37.37730499999999, lng=-121.8894033 
        getWeather({ 'lat': lat, 'lng': lng },
            function(data) {
                response.write(data);
                response.end();
            });
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
