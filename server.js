const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const fs = require("fs");
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const chalk = require('chalk')

const optionDefinitions = [
  { name: 'directory', alias: 'd', type: String, defaultValue: 'dist', description: 'The location of the directory to stream content from. (Defaults to "dist")' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 80, description: 'Port on which to run the server. (Defaults to "80")' },
  { name: 'database-address', alias: 'a', type: String, defaultValue: "http://localhost", description: 'Address on which the server redirects database requests to. (Defaults to "http://localhost")' },
  { name: 'database-port', alias: 'o', type: Number, defaultValue: 5984, description: 'Port on which the server redirects database requests to. (Defaults to "5984")' },
  { name: 'log-file-requests', alias: 'r', type: Boolean, description: 'Enable logging requests to the server for files.' },
  { name: 'log-db-requests', alias: 'l', type: Boolean, description: 'Enable logging requests for the database.' },
  { name: 'use-ssl', alias: 's', type: Boolean, description: 'Enable SSL. (EXPERIMENTAL)' },
  { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage guide.' }
]

const options = commandLineArgs(optionDefinitions, { camelCase: true, partial: true });

if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'Scouting App - Server',
      content: 'A web app made with Vue and PouchDB specifically for FRC scouting.'
    },
    {
      header: 'Launch options',
      optionList: optionDefinitions
    },
    {
      content: 'Project home: {underline https://github.com/Damian0001/Scouting-App}'
    }
  ])
  console.log(usage)

  return;
}

const LOCAL_DATABASE = "/database";
const PROXY_TARGET = options.databaseAddress + ':' + options.databasePort;
const DIRECTORY = options.directory;
const PORT = options.port;

const proxy = httpProxy.createProxyServer({});

const handler = function (request, response) {
  var url = request.url;

  if (url.startsWith(LOCAL_DATABASE)) {
    var modifiedRequest = request;
    modifiedRequest.url = request.url.replace(LOCAL_DATABASE, "");

    if (options.logDbRequests)
      console.log(chalk.gray(request.connection.remoteAddress + ": " + modifiedRequest.url));

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

    if (options.logFileRequests)
      console.log(chalk.gray(request.connection.remoteAddress + ": " + url + " > " + file));

    fs.readFile(DIRECTORY + file, (err, content) => {
      if (err) {
        if (options.logFileRequests)
          console.log('We cannot open file.');
      }

      response.writeHead(200, {
        'Content-Type': type
      })

      response.end(content)
    })
  }
};

var server;

if (options.useSsl) {
  try {
    var cert = {
      key: fs.readFileSync('certs/server-key.pem'),
      cert: fs.readFileSync('certs/server-crt.pem'),
      ca: fs.readFileSync('certs/ca-crt.pem'),
    };

    server = https.createServer(cert, handler).listen(PORT);;
  } catch (err) {
    console.log("Error while creating HTTPS server");
  }
} else {
  server = http.createServer(handler).listen(PORT);;
}

proxy.on('error', function (err, req, response) {
  response.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  response.end('Something went wrong. Maybe the database is down?');
});

console.log(chalk.cyan('Listening on port %s\nFiles are streamed from %s\nDatabase requests are redirected to %s'), chalk.yellowBright(PORT), chalk.yellowBright(DIRECTORY), chalk.yellowBright(PROXY_TARGET));