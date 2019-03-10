# Scouting App

## Supported Browsers
Desktop Browsers
* Chrome (And all Chromium browsers probably)

* Firefox

* Edge

Mobile Browsers
* Chrome

* Safari


## Installation
Install CouchDB. (Or [pouchdb-server](https://github.com/pouchdb/pouchdb-server) for testing. Not recommended for production)

Create an admin account at `http://localhost:5984/_utils/`. This account will be what you'll use to login and create user accounts with for the first time. (Note: The username MUST be all lowercase)

Create a database named "scouting".

Install [NPM](https://www.npmjs.com/get-npm).

Clone this repository using `git clone https://github.com/Damian0001/Scouting-App.git`.

Move inside the cloned repositiory with `cd scouting-app`.

Run `npm install`.

Run `npm run build`.

Run `node server.js`.

### Launch Options

```-d, --directory string          The location of the directory to stream content from. (Defaults to "dist")
-p, --port number               Port on which to run the server. (Defaults to "80")
-a, --database-address string   Address on which the server redirects database requests to. (Defaults to
                                "http://localhost")
-o, --database-port number      Port on which the server redirects database requests to. (Defaults to "5984")
-r, --log-file-requests         Enable logging requests to the server for files.
-l, --log-db-requests           Enable logging requests for the database.
-s, --use-ssl                   Enable SSL. Read how to use it here: https://github.com/Damian0001/Scouting-
                                App#enable-ssl
```

# Enable SSL
Create a folder in the same directory as server.js and call it "certs"

Inside this folder create 3 files coresponding to their respective purposes

- server-key.pem
- server-crt.pem
- ca-crt.pem
