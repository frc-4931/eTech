var http = require('http');
var httpProxy = require('http-proxy');
var fs = require("fs");

var SERVER_DATABASE = "/scouting";
var LOCAL_DATABASE = "/database";
var PROXY_TARGET = 'http://localhost:5984';
var DIRECTORY = process.argv[2] || "";
var PORT = parseInt(process.argv[3]) || 80;

var proxy = httpProxy.createProxyServer({});
var server = http.createServer(function (request, response) {

  var url = request.url;

  if (url.startsWith(LOCAL_DATABASE)) {
    var modifiedRequest = request;
    modifiedRequest.url = request.url.replace(LOCAL_DATABASE, "");

    proxy.web(modifiedRequest, response, {
      target: PROXY_TARGET
    });
  } else {
    var file;
    var type = "text/html";

    if (url.includes("..")) {
      file = "/index.html";
    } else if (url.endsWith(".css") && url.startsWith("/css/")) {
      file = url;
      type = "text/css";
    } else if (url.endsWith(".js") && url.startsWith("/js/")) {
      file = url;
    } else if (url.endsWith(".js.map") && url.startsWith("/js/")) {
      file = url;
    } else if (url.startsWith("/favicon/")) {
      file = url.substring(8, url.length);
      if (url.endsWith(".png")) type = "image/x-icon";
    } else {
      file = "/index.html";
    }

    console.log(request.connection.remoteAddress + ": " + url + " > " + file);

    fs.readFile(DIRECTORY + file, (err, content) => {
      if (err) {
        console.log('We cannot open file.')
      }

      response.writeHead(200, {
        'Content-Type': type
      })

      response.end(content)
    })
  }
});

console.log('Listening on port %s', PORT);
server.listen(PORT);