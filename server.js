const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");
const fs = require("fs");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const chalk = require("chalk");
const pouchdb = require("pouchdb");
pouchdb.plugin(require("pouchdb-authentication"));

const request = require("request");

const optionDefinitions = [
  {
    name: "directory",
    alias: "d",
    type: String,
    defaultValue: "dist",
    description:
      'The location of the directory to stream content from. (Defaults to "dist")'
  },
  {
    name: "port",
    alias: "p",
    type: Number,
    defaultValue: 80,
    description: 'Port on which to run the server. (Defaults to "80")'
  },
  {
    name: "database-address",
    alias: "a",
    type: String,
    defaultValue: "http://localhost",
    description:
      'Address on which the server redirects database requests to. (Defaults to "http://localhost")'
  },
  {
    name: "database-port",
    alias: "o",
    type: Number,
    defaultValue: 5984,
    description:
      'Port on which the server redirects database requests to. (Defaults to "5984")'
  },
  {
    name: "log-file-requests",
    alias: "r",
    type: Boolean,
    description: "Enable logging requests to the server for files."
  },
  {
    name: "log-db-requests",
    alias: "l",
    type: Boolean,
    description: "Enable logging requests for the database."
  },
  {
    name: "use-ssl",
    alias: "s",
    type: Boolean,
    description:
      "Enable SSL. Read how to use it here: https://github.com/Damian0001/Scouting-App#enable-ssl"
  },
  {
    name: "tba-enabled",
    type: Boolean,
    description: "Enables The Blue Alliance integration."
  },
  {
    name: "tba-db-login",
    type: String,
    description: "Your username and password seperated by ':' (Example: 'admin:password')."
  },
  {
    name: "tba-interval",
    type: Number,
    defaultValue: 30,
    description: "Amount of time in seconds between pinging The Blue Alliance for data (Defaults to '30')."
  },
  {
    name: "tba-auth-key",
    type: String,
    description: "Your The Blue Alliance auth key."
  },
  {
    name: "tba-event-key",
    type: String,
    description: "The Blue Alliance event key for your current competition."
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide."
  },
];

const options = commandLineArgs(optionDefinitions, {
  camelCase: true,
  partial: true
});

if (options.help) {
  const usage = commandLineUsage([
    {
      header: "Scouting App - Server",
      content:
        "A web app made with Vue and PouchDB specifically for FRC scouting."
    },
    {
      header: "Launch options",
      optionList: optionDefinitions
    },
    {
      content:
        "Read more at: {underline https://github.com/Damian0001/Scouting-App/blob/master/README.md}"
    }
  ]);
  console.log(usage);
  process.exit();
}

const LOCAL_DATABASE = "/database";
const PROXY_TARGET = options.databaseAddress + ":" + options.databasePort;
const DIRECTORY = options.directory;
const PORT = options.port;

const proxy = httpProxy.createProxyServer({});

proxy.on("error", function (err, req, response) {
  response.writeHead(500, {
    "Content-Type": "text/plain"
  });

  response.end("Something went wrong. Maybe the database is down?");
});

const handler = function (request, response) {
  var url = request.url;

  if (url.startsWith(LOCAL_DATABASE)) {
    var modifiedRequest = request;
    modifiedRequest.url = request.url.replace(LOCAL_DATABASE, "");

    if (options.logDbRequests)
      console.log(
        chalk.gray(
          request.connection.remoteAddress + ": " + modifiedRequest.url
        )
      );

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
      console.log(
        chalk.gray(request.connection.remoteAddress + ": " + url + " > " + file)
      );

    fs.readFile(DIRECTORY + file, (err, content) => {
      var responseCode = 200;
      if (err) {
        if (options.logFileRequests) console.log("We cannot open file.");
        responseCode = 404;
      }

      response.writeHead(responseCode, {
        "Content-Type": type
      });

      response.end(content);
    });
  }
};

if (options.useSsl) {
  try {
    var certificate = {
      key: fs.readFileSync("certs/server-key.pem"),
      cert: fs.readFileSync("certs/server-crt.pem"),
      ca: fs.readFileSync("certs/ca-crt.pem")
    };

    server = https
      .createServer(certificate, handler)
      .on("error", function (err) {
        console.log(
          chalk.redBright(
            "Error while creating HTTPS server. Maybe port %s is already in use or you don't have permision to start a server?\nError message: %s"
          ),
          PORT,
          chalk.white(err.message)
        );
        process.exit();
      })
      .listen(PORT);
  } catch (err) {
    console.log(
      chalk.redBright(
        "Error while reading certificate, maybe your certificate is missing?\nError message: %s"
      ),
      PORT,
      chalk.white(err.message)
    );
    process.exit();
  }
} else {
  server = http
    .createServer(handler)
    .on("error", function (err) {
      console.log(
        chalk.redBright(
          "Error while creating HTTP server. Maybe port %s is already in use or you don't have permision to start a server?\nError message: %s"
        ),
        PORT,
        chalk.white(err.message)
      );
      process.exit();
    })
    .listen(PORT);
}

var useBA = options.tbaEnabled;
if (useBA) {
  var tbaDB = new pouchdb(PROXY_TARGET + "/bluealliance");
  var tbaLogin = options.tbaDbLogin.split(":", 1);
  tbaDB.logIn(tbaLogin[0], tbaLogin[1])

  var baKey = "GZSwS1Bx1TPPVjDLogJ9az42js2sehTlA8N3lnCi8LqG8FhOdCwAvfvQzT0mFz65";
  var baEvent = "2019nytr";

  var runBA = function () {
    if (!runBA) return;

    var options = {
      url: "https://www.thebluealliance.com/api/v3/event/" + baEvent + "/matches",
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": baKey
      }
    };

    request(options, function (err, res, body) {
      if (err) {
        console.log("Error pulling")
      }


      var data = JSON.parse(body);

      baDB
        .get("MATCHES")
        .then(function (doc) {
          doc.json = data;
          baDB.put(doc);
        })
        .catch(function (err) {
          var doc = { _id: "MATCHES", json: data };
          baDB.put(doc);
        });
    });
  };

  var intervalTime = options.tbaInterval * 1000;
  setInterval(runBA, intervalTime);
}

console.log(
  chalk.cyan(
    "Running on port %s\nStreaming files from %s\nRedirecting database requests to %s"
  ),
  chalk.yellowBright(PORT),
  chalk.yellowBright(DIRECTORY),
  chalk.yellowBright(PROXY_TARGET)
);

if (options.logFileRequests)
  console.log(chalk.cyan(" - Logging file requests to the console is enabled"));
if (options.logDbRequests)
  console.log(
    chalk.cyan(" - Logging database requests to the console is enabled")
  );
if (options.useSsl) console.log(chalk.cyan(" - SSL is enabled"));
if (options.tbaEnabled) console.log(" - The Blue Alliance integration is enabled")