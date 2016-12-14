const PORT = 8889;

var http = require("http");
var https = require("https");
var url = require("url");

var googleApiKey = "AIzaSyAWb5olGhXydFCpRmGhTJGOCP8yKsN6DLY";

// var zipCode = "94539";

// get is a simple wrapper for request()
// which sets the http method to GET

/*
var options = {
  host: "www-proxy.us.oracle.com",
  port: 80,
  path: url
};
*/

/*
getLatLongForZipcode(zipCode, function(p_id) {
    console.log("Got Lat, Long:", p_id);
});

getGolfCoursesForZipcode(94539, function(ll) {
    console.log("========================");
    console.log(ll);
});
*/


function getGolfCoursesForZipcode(zip, callback) {
    getLatLongForZipcode(zip, function(ll) {
        var lat = JSON.stringify(ll.lat);
        var lng = JSON.stringify(ll.lng);
        var u = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat +
                "," + lng + "&radius=50000&keyword=Golf+Course&key=" + googleApiKey;

        getJSONData(u, function(data) {
            var results = data.results;
            var ans = [];
            for (var i = 0; i < results.length; i++) {
                var jsonData = {};
                var s = JSON.stringify(results[i].name);
                if ((s.includes("Golf")) || (s.includes("golf"))) {
                    jsonData["name"] = results[i].name;
                    jsonData["lat"] = results[i].geometry.location.lat;
                    jsonData["lng"] = results[i].geometry.location.lng;
                    ans.push(jsonData);
                }
            }
            callback(ans);
        });
    });
}

function getLatLongForZipcode(zip, callback) {
    var u = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + zip +"&" + "key=" + googleApiKey;
//    console.log("URL --- " + u);
    getJSONData(u, function(data) {
        var p = data.results[0].geometry.location;
//        console.log("location:", p);
        callback(p);
    });
}

function getJSONData(url, callback) {
   var buffer = "",
        data;

    https.get(url, (res) => {
      console.log('statusCode:', res.statusCode);
//      console.log('headers:', res.headers);

      res.on('data', (d) => {
        buffer += d;
    //    process.stdout.write(d);
      });

      res.on('end', (f) => {
        // finished transferring data
        // dump the raw data
        data = JSON.parse(buffer);
        callback(data);
    //    console.log("========================");
    //    console.log(data);
      });

      res.on('error', (e) => {
         console.error(e);
      });
    });
}

function handleRequest(request, response){
//    console.log(request.url);
    var queryObj = url.parse(request.url,true).query;
    var zipCode = queryObj.zipcode;
    if (typeof zipCode !== 'undefined' && zipCode) {
        getGolfCoursesForZipcode(zipCode, function(ll) {
//            console.log("Got Lat, Long:", ll);
            response.write(JSON.stringify(ll));
            response.end();
        });

    } else {
        response.write('{}');
        response.end();
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
