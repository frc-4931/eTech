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
const crypto = require("crypto");

const optionDefinitions = [{
  name: "cache-files",
  alias: "c",
  type: Boolean,
  description: 'Cache files in memory (EXPERIMENTAL)'
},
{
  name: "directory",
  alias: "d",
  type: String,
  defaultValue: "dist",
  description: 'The location of the directory to stream content from. (Defaults to "dist")'
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
  description: 'Address on which the server redirects database requests to. (Defaults to "http://localhost")'
},
{
  name: "database-port",
  alias: "o",
  type: Number,
  defaultValue: 5984,
  description: 'Port on which the server redirects database requests to. (Defaults to "5984")'
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
  description: "Enable SSL. Read how to use it here: https://github.com/frc-4931/eTech#enable-ssl"
},
{
  name: "tba-disabled",
  type: Boolean,
  description: "Disables The Blue Alliance integration."
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
  defaultValue: 60,
  description: "Amount of time in seconds between pinging The Blue Alliance for data (Defaults to '60')."
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
  const usage = commandLineUsage([{
    header: "eTech: Scouting Done Right - Server",
    content: "eTech is an all-in-one web application that allows users to continue scouting when offline, and when the user revives their connection the information is automatically synced to all other devices, and their screens are updated in real time."
  },
  {
    header: "Launch options",
    optionList: optionDefinitions
  },
  {
    content: "Read more at: {underline https://github.com/frc-4931/eTech/blob/master/README.md}"
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
  return chalk.white(new Date().toLocaleString([], {
    hour12: false
  })) + "   ";
}

proxy.on("error", function (err, req, response) {
  try {
    response.writeHead(500, {
      "Content-Type": "text/plain",
    });

    response.end("Something went wrong. Maybe the database is down?");
  } catch (err) {
    console.log(err)
  }
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
          response.writeHead(200, {
            "Content-Type": "text/plain"
          });
          response.end("The requested URL " + url + " was not found on this server");
        } else {
          if (options.cacheFiles) fileCache.set(file, fileContents);

          response.writeHead(200, {
            "Content-Type": type
          });
          response.end(fileContents);
        }
      });
    } else {
      response.writeHead(200, {
        "Content-Type": type
      });
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

// Create a design doc
var getDesginDoc = (hashVal) => {
  /* eslint-disable no-undef */
  var validate = function (newDoc, oldDoc, userCtx) {
    if (newDoc._id == "DB_HASH") {
      if (userCtx.roles.indexOf("_admin") != -1) return true;
      throw ({ forbidden: "You must be an admin to change the hash!" })
    }

    if (newDoc._id.substr(0, "_local".length).toUpperCase() == "_local".toUpperCase()) return true;

    if (!(newDoc._id.substr(0, DBHASHVAL.length).toUpperCase() == DBHASHVAL.toUpperCase())) throw ({ forbidden: "Doc does not start with hash!" })

    if (userCtx.roles.indexOf("_admin") == -1 && userCtx.roles.indexOf("edit") == -1) throw ({ forbidden: "You do not have editing privilages." })

    var id = newDoc._id.replace(DBHASHVAL, "");
    if (id == "TEMPLATE_MATCHSCOUT" || id == "TEMPLATE_PITSCOUT") {
      if (userCtx.roles.indexOf("_admin") == -1) throw ({ forbidden: "You must be admin to modify templates!" })
    }
  }
  var filter = function (doc) {
    if (doc._id.substr(0, DBHASHVAL.length).toUpperCase() == DBHASHVAL.toUpperCase()) return true;

    if (doc._id == "_design/general") return true;
  }
  /* eslint-enable no-undef */

  var doc = {
    "_id": "_design/general",
    "validate_doc_update": validate.toString().replace(new RegExp("DBHASHVAL", 'g'), '"' + hashVal + '"'),
    "filters": {
      "filterbyhash": filter.toString().replace(new RegExp("DBHASHVAL", 'g'), '"' + hashVal + '"')
    }
  }

  return doc;
};

// Check DB for CUR_DB_VERSION => If not exisits create with version 1
var verifyDBHash = (db, hashObj) => {
  return new Promise((resolve, reject) => {
    db.get("DB_HASH").then((doc) => {
      if (doc.db_hash) {
        hashObj.hash = doc.db_hash + "_";
        db.get("_design/general").then(resolve).catch(() => {
          db.put(getDesginDoc(hashObj.hash)).then(resolve).catch((err) => {
            console.log(err)
            process.exit();
          });
        });
      } else {
        doc.db_hash = crypto.randomBytes(20).toString('hex');
        db.put(doc).then(() => {
          hashObj.hash = doc.db_hash + "_";
          db.put(getDesginDoc(hashObj.hash)).then(resolve).catch((err) => {
            console.log(err)
            process.exit();
          });
        }).catch(reject);
      }
    }).catch(err => {
      if (err.status == 404) {
        var hash = crypto.randomBytes(20).toString('hex');
        var doc = {
          _id: "DB_HASH",
          db_hash: hash
        }
        db.put(doc).then(() => {
          hashObj.hash = doc.db_hash + "_";
          db.put(getDesginDoc(hashObj.hash)).then(resolve).catch((err) => {
            console.log(err)
            process.exit();
          });
        }).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Create DB(s)
var useBA = !options.tbaDisabled;
try {
  var tbaLogin = options.tbaDbLogin.split(":", 2);
} catch (exept) {
  console.log(chalk.redBright("Error while trying to parse database loggin credentials."));
  process.exit();
}

var scoutingDB = new pouchdb(PROXY_TARGET + "/scouting", {
  auth: {
    username: tbaLogin[0],
    password: tbaLogin[1]
  }
})
var tbaDB = (useBA) ? new pouchdb(PROXY_TARGET + "/bluealliance", {
  auth: {
    username: tbaLogin[0],
    password: tbaLogin[1]
  }
}) : {};

var scoutingDBHash = { hash: "" };
var tbaDBHash = { hash: "" };

// TBA routine
var teamKeys = [];
var matchKeys = [];

var baKey;
var baEvent;
var runBA = function () {
  if (!useBA) return;

  var pushOptions = {
    url: "https://www.thebluealliance.com/api/v3/",
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": baKey
    }
  };

  var getMatchKeys = () => {
    return new Promise((resolve, reject) => {
      var opt = {};
      Object.assign(opt, pushOptions);
      var url = "event/" + baEvent + "/matches/keys";
      opt.url += url;

      if (options.tbaLog)
        console.log(
          getTime() + chalk.blue("Caching match keys: ") + chalk.gray(url)
        );

      request(opt, function (err, res, body) {
        if (err) {
          console.log(getTime() + chalk.redBright("Error pulling data (" + url + ") from The Blue Alliance."));
          reject(err);
          return;
        }

        var data = JSON.parse(body);

        if (data.Error) {
          console.log(getTime() + chalk.redBright("Error: '" + data.Error + "' when pulling data (" + url + ") from The Blue Alliance."));
          return;
        }

        matchKeys = data;
        resolve();
      });
    });
  }

  var getTeamKeys = () => {
    return new Promise((resolve, reject) => {
      var opt = {};
      Object.assign(opt, pushOptions);
      var url = "event/" + baEvent + "/teams/keys";
      opt.url += url;

      if (options.tbaLog)
        console.log(
          getTime() + chalk.blue("Caching team keys: ") + chalk.gray(url)
        );

      request(opt, function (err, res, body) {
        if (err) {
          console.log(getTime() + chalk.redBright("Error pulling data (" + url + ") from The Blue Alliance."));
          reject(err);
          return;
        }

        var data = JSON.parse(body);

        if (data.Error) {
          console.log(getTime() + chalk.redBright("Error: '" + data.Error + "' when pulling data (" + url + ") from The Blue Alliance."))
          return;
        }

        teamKeys = data;
        resolve();
      });
    });
  }

  var cacheToFile = (url, file) => {
    return new Promise((resolve, reject) => {
      var opt = {};
      Object.assign(opt, pushOptions);
      opt.url += url;

      if (options.tbaLog)
        console.log(
          getTime() + chalk.blue("Saving to file: ") + chalk.gray(url + " > " + file)
        );

      request(opt, function (err, res, body) {
        if (err) {
          console.log(getTime() + chalk.redBright("Error pulling data (" + url + ") from The Blue Alliance."))
          reject();
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

              tbaDB.put(doc).then(() => resolve());
            } else {
              resolve();
            }
          })
          .catch(function () {
            var doc = {
              _id: file,
              json: data,
              lastModified: date
            };
            tbaDB.put(doc).then(() => {
              resolve()
            }).catch(function (err) {
              console.log(err);
              reject();
            });
          });
      });
    });
  }

  var addTeam = (teamKey) => {
    var teamNumber = teamKey.replace("frc", "");

    scoutingDB.get(scoutingDBHash.hash + "TEAM_" + teamNumber).then(() => {
      return
    }).catch(() => {
      tbaDB.get(tbaDBHash.hash + "TEAMINFO_frc" + teamNumber).then(function (doc) {

        var file = {
          name: doc.json.nickname,
          number: doc.json.team_number,
          objectivePoints: 0,
          commentPoints: 0,
          _id: scoutingDBHash.hash + "TEAM_" + doc.json.team_number
        };

        scoutingDB.put(file).then(() => {
          if (options.tbaLog)
            console.log(getTime() + chalk.blue("Adding team: ") + chalk.gray(file.number))
        }).catch(() => {
          return
        });
      }).catch(() => {
        return
      });
    })
  }

  var getTeamInfo = () => {
    return new Promise(function (resolve) {
      var i = 0;

      for (let teamKey of teamKeys) {
        var promises = [
          // cacheToFile("team/" + teamKey + "/event/" + baEvent + "/status", tbaDBHash.hash + "TEAMSTATUS_" + teamKey),
          cacheToFile("team/" + teamKey + "/event/" + baEvent + "/matches/keys", tbaDBHash.hash + "TEAMMATCHES_" + teamKey),
          // cacheToFile("team/" + teamKey + "/years_participated", tbaDBHash.hash + "TEAMYEARS_" + teamKey),
          cacheToFile("team/" + teamKey, tbaDBHash.hash + "TEAMINFO_" + teamKey),
          // cacheToFile("team/" + teamKey + "/event/" + baEvent + "/awards", tbaDBHash.hash + "TEAMAWARDS_" + teamKey)
        ];

        Promise.all(promises).then(() => {
          i++;

          if (i == teamKeys.length) resolve();
        }).catch(() => {
          return
        });
      }
    });
  }

  getTeamKeys().then(() => {
    getMatchKeys().then(() => {
      for (let matchKey of matchKeys) {
        //cacheToFile("match/" + matchKey, tbaDBHash.hash + "MATCH_" + matchKey); // Full match breakdown
        cacheToFile("match/" + matchKey + "/simple", tbaDBHash.hash + "MATCHSIMPLE_" + matchKey); // Simple match breakdown
      }

      getTeamInfo().then(() => {
        for (let teamKey of teamKeys) {
          addTeam(teamKey);
        }
      });

      cacheToFile("event/" + baEvent + "/rankings", tbaDBHash.hash + "RANKINGS");
      cacheToFile("event/" + baEvent + "/alliances", tbaDBHash.hash + "ALLIANCES");
      cacheToFile("event/" + baEvent + "/awards", tbaDBHash.hash + "AWARDS");
    });
  });
};

// DB login
scoutingDB.logIn(tbaLogin[0], tbaLogin[1]).catch((err) => {
  console.log(chalk.redBright("Error while logging into the scouting database."));
  console.log(err)
  process.exit();
}).then((userCtx) => {
  return verifyDBHash(scoutingDB, scoutingDBHash).catch((err) => {
    console.log("Error verifying DB hash for scoutingDB", err)
    process.exit();
  });
}).then(() => {
  return new Promise((resolve) => {
    if (useBA) {
      tbaDB.logIn(tbaLogin[0], tbaLogin[1]).catch((err) => {
        console.log(chalk.redBright("Error while logging into The Blue Alliance database."));
        console.log(err)
        process.exit();
      }).then(() => {
        return verifyDBHash(tbaDB, tbaDBHash).then(resolve).catch((err) => {
          console.log("Error verifying DB hash for tbaDB", err)
          process.exit();
        });
      });
    } else resolve();
  });
}).then(() => {
  if (!useBA) return;

  if (options.tbaAuthKey) {
    baKey = options.tbaAuthKey;
  } else {
    console.log(chalk.redBright("Error: You must supply a The Blue Alliance authentication key using --tba-auth-key as a launch option when TBA integration is enabled."));
    process.exit();
  }

  if (options.tbaEventKey) {
    baEvent = options.tbaEventKey;
  } else {
    console.log(chalk.redBright("Error: You must supply a The Blue Alliance event key by using --tba-event-key as a launch option when TBA integration is enabled."));
    process.exit();
  }

  var intervalTime = options.tbaInterval * 1000;
  setInterval(runBA, intervalTime);
  runBA();
})

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
if (options.tbaDisabled) console.log(chalk.cyan(" - The Blue Alliance integration is disabled"))
if (options.tbaLog)
  console.log(
    chalk.cyan(" - Logging The blue Alliance requests to the console is enabled")
  );