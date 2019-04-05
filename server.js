/* eslint-disable no-console */
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
    name: "cache-files",
    alias: "c",
    type: Boolean,
    description:
      'Cache files in memory (EXPERIMENTAL)'
  },
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
      "Enable SSL. Read how to use it here: https://github.com/frc-4931/eTech#enable-ssl"
  },
  {
    name: "tba-enabled",
    type: Boolean,
    description: "Enables The Blue Alliance integration."
  },
  {
    name: "tba-log",
    type: Boolean,
    description: "Enables logging requests for The Blue Alliance."
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
      header: "eTech: Scouting Done Right - Server",
      content:
        "eTech is an all-in-one web application that allows users to continue scouting when offline, and when the user revives their connection the information is automatically synced to all other devices, and their screens are updated in real time."
    },
    {
      header: "Launch options",
      optionList: optionDefinitions
    },
    {
      content:
        "Read more at: {underline https://github.com/Damian0001/etech/blob/master/README.md}"
    }
  ]);
  console.log(usage);
  process.exit();
}

const DATABASE_URL = "/database";
const PROXY_TARGET = options.databaseAddress + ":" + options.databasePort;
const DIRECTORY = options.directory;
const PORT = options.port;

const proxy = httpProxy.createProxyServer({});

const fileCache = new Map();

var getTime = function () {
  return chalk.white(new Date().toLocaleString([], { hour12: false })) + "   ";
}

proxy.on("error", function (err, req, response) {
  response.writeHead(500, {
    "Content-Type": "text/plain"
  });

  response.end("Something went wrong. Maybe the database is down?");
});

const handler = function (request, response) {
  var url = request.url;

  if (url.startsWith(DATABASE_URL)) {
    var modifiedRequest = request;
    modifiedRequest.url = request.url.replace(DATABASE_URL, "");

    if (options.logDbRequests)
      console.log(
        getTime() + chalk.gray(
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
    } else if ((url.endsWith(".js") || url.endsWith(".js.map")) && url.startsWith("/js/")) {
      file = url;
      type = "text/javascript";
    } else if (url.startsWith("/favicon/")) {
      file = url.substring(8, url.length);
      if (url.endsWith(".png")) type = "image/x-icon";
      else if (url.endsWith(".svg")) type = "image/svg+xml";
    } else {
      file = "/index.html";
    }

    if (options.logFileRequests) console.log(getTime() + chalk.gray(request.connection.remoteAddress + ": " + url + " > " + file));

    var content = fileCache.get(file);

    if (options.cacheFiles ? content == undefined : true) {
      fs.readFile(DIRECTORY + file, "utf8", (err, fileContents) => {
        if (err) {
          if (options.logFileRequests) console.log(getTime() + chalk.gray("Cannot open file: " + file));
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.end("The requested URL " + url + " was not found on this server");
        } else {
          if (options.cacheFiles) fileCache.set(file, fileContents);

          response.writeHead(200, { "Content-Type": type });
          response.end(fileContents);
        }
      });
    } else {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    }
  }
};

if (options.useSsl) {
  try {
    var certificate = {
      key: fs.readFileSync("certs/server-key.pem"),
      cert: fs.readFileSync("certs/server-crt.pem"),
      ca: fs.readFileSync("certs/ca-crt.pem")
    };

    https
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
  http
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

// The Blue Alliance Intigration
var useBA = options.tbaEnabled;
var teamKeys = [];
var matchKeys = [];
if (useBA) {
  var tbaDB = new pouchdb(PROXY_TARGET + "/bluealliance");
  try {
    var tbaLogin = options.tbaDbLogin.split(":", 2);
  } catch (exept) {
    console.log(chalk.redBright("Error while trying to parse database loggin credentials."));
    process.exit();
  }
  tbaDB.logIn(tbaLogin[0], tbaLogin[1]).catch(function (err) {
    console.log(chalk.redBright("Error while logging into The Blue Alliance database."));
    console.log(err)
    process.exit();
  });

  var baKey;
  var baEvent;

  if (options.tbaAuthKey) {
    baKey = options.tbaAuthKey;
  } else {
    console.log(chalk.redBright("Error: You must supply a The Blue Alliance authentication key when TBA integration is enabled."));
    process.exit();
  }

  if (options.tbaEventKey) {
    baEvent = options.tbaEventKey;
  } else {
    console.log(chalk.redBright("Error: You must supply a The Blue Alliance event key when TBA integration is enabled."));
    process.exit();
  }

  let argOptions = options;
  var runBA = function () {
    if (!useBA) return;

    var options = {
      url: "https://www.thebluealliance.com/api/v3/",
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": baKey
      }
    };

    var getMatchKeys = function () {
      var opt = {};
      Object.assign(opt, options);
      var url = "event/" + baEvent + "/matches/keys";
      opt.url += url;

      if (argOptions.tbaLog)
        console.log(
          getTime() + chalk.blue("Caching match keys: ") + chalk.gray(url)
        );

      request(opt, function (err, res, body) {
        if (err) {
          console.log(getTime() + chalk.redBright("Error pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        var data = JSON.parse(body);

        if (data.Error) {
          console.log(getTime() + chalk.redBright("Error: '" + data.Error + "' when pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        matchKeys = data;
      });
    }

    var getTeamKeys = function () {
      var opt = {};
      Object.assign(opt, options);
      var url = "event/" + baEvent + "/teams/keys";
      opt.url += url;

      if (argOptions.tbaLog)
        console.log(
          getTime() + chalk.blue("Caching team keys: ") + chalk.gray(url)
        );

      request(opt, function (err, res, body) {
        if (err) {
          console.log(getTime() + chalk.redBright("Error pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        var data = JSON.parse(body);

        if (data.Error) {
          console.log(getTime() + chalk.redBright("Error: '" + data.Error + "' when pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        teamKeys = data;
      });
    }

    var cacheToFile = function (url, file) {
      var opt = {};
      Object.assign(opt, options);
      opt.url += url;

      if (argOptions.tbaLog)
        console.log(
          getTime() + chalk.blue("Saving to file: ") + chalk.gray(url + " > " + file)
        );

      request(opt, function (err, res, body) {

        if (err) {
          console.log(getTime() + chalk.redBright("Error pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        var data = JSON.parse(body);

        if (data.Error) {
          console.log(getTime() + chalk.redBright("Error: '" + data.Error + "' when pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        var date = new Date(res.headers["last-modified"]).getTime();

        tbaDB
          .get(file)
          .then(function (doc) {
            if (doc.lastModified === undefined || isNaN(doc.lastModified) || doc.lastModified < date) {
              doc.json = data;
              doc.lastModified = date;

              tbaDB.put(doc).catch(function (err) {
                console.log(err)
              });
            }
          })
          .catch(function () {
            var doc = { _id: file, json: data, lastModified: date };
            tbaDB.put(doc).catch(function (err) {
              console.log(err)
            });
          });
      });
    }

    if (teamKeys.length == 0)
      getTeamKeys();
    if (matchKeys.length == 0)
      getMatchKeys();

    //cacheToFile("event/" + baEvent + "/matches/simple", "MATCHES"); // Leaving original API in until fully removed from client

    //Change to individual files to reduce amount of data downloaded at a time. Will also reduce loading times.
    for (let matchKey of matchKeys) {
      cacheToFile("match/" + matchKey, "MATCH_" + matchKey) // Full match breakdown
      cacheToFile("match/" + matchKey + "/simple", "MATCHSIMPLE_" + matchKey) // No full match breakdown
    }

    for (let teamKey of teamKeys) {
      cacheToFile("team/" + teamKey + "/event/" + baEvent + "/status", "TEAMSTATUS_" + teamKey)
      cacheToFile("team/" + teamKey + "/event/" + baEvent + "/matches/keys", "TEAMMATCHES_" + teamKey)
      cacheToFile("team/" + teamKey + "/years_participated", "TEAMYEARS_" + teamKey)
      cacheToFile("team/" + teamKey, "TEAMINFO_" + teamKey)
      cacheToFile("team/" + teamKey + "/event/" + baEvent + "/awards", "TEAMAWARDS_" + teamKey)
    }

    cacheToFile("event/" + baEvent + "/rankings", "RANKINGS");
    cacheToFile("event/" + baEvent + "/alliances", "ALLIANCES");
    cacheToFile("event/" + baEvent + "/awards", "AWARDS");
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

if (options.cacheFiles)
  console.log(chalk.cyan(" - Caching files is enabled"));
if (options.logFileRequests)
  console.log(chalk.cyan(" - Logging file requests to the console is enabled"));
if (options.logDbRequests)
  console.log(
    chalk.cyan(" - Logging database requests to the console is enabled")
  );
if (options.useSsl) console.log(chalk.cyan(" - SSL is enabled"));
if (options.tbaEnabled) console.log(chalk.cyan(" - The Blue Alliance integration is enabled"))
if (options.tbaLog)
  console.log(
    chalk.cyan(" - Logging The blue Alliance requests to the console is enabled")
  );