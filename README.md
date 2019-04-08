# eTech
eTech is an all-in-one web application that allows users to continue scouting when offline, and when the user revives their connection the information is automatically synced to all other devices, and their screens are updated in real time.

## Supported Browsers
Desktop Browsers
* Chrome (And all Chromium browsers probably)

* Firefox

* Edge

Mobile Browsers
* Chrome

* Safari


## Installation

<b>IN THE FUTURE WE WILL MOVE TO A DIFFERENT DISTRIBUTION SYSTEM SUCH AS DOCKER</b>

Install [CouchDB](https://docs.couchdb.org/en/stable/install/index.html). (Or [pouchdb-server](https://github.com/pouchdb/pouchdb-server) for testing. Not recommended for production)

Create an admin account at `http://localhost:5984/_utils/`. This account will be what you'll use to login and create user accounts with for the first time. (Note: The username MUST be all lowercase)

Create a database named "scouting".

Install [NPM](https://www.npmjs.com/get-npm).

Clone this repository using `git clone https://github.com/frc-4931/eTech.git`.

Move inside the cloned repositiory with `cd eTech`.

Run `npm install`.

Run `npm run build`.

Run `node server.js`.

## Launch Options

```
  -c, --cache-files               Cache files in memory (EXPERIMENTAL)
  -d, --directory string          The location of the directory to stream content from. (Defaults to "dist")
  -p, --port number               Port on which to run the server. (Defaults to "80")
  -a, --database-address string   Address on which the server redirects database requests to. (Defaults to
                                  "http://localhost")
  -o, --database-port number      Port on which the server redirects database requests to. (Defaults to "5984")
  -r, --log-file-requests         Enable logging requests to the server for files.
  -l, --log-db-requests           Enable logging requests for the database.
  -s, --use-ssl                   Enable SSL. Read how to use it here: https://github.com/frc-
                                  4931/eTech#enable-ssl
  --tba-disabled                  Disables The Blue Alliance integration.
  --tba-log                       Enables logging requests for The Blue Alliance.
  --tba-db-login string           Your username and password seperated by ':' (Example: 'admin:password').
  --tba-interval number           Amount of time in seconds between pinging The Blue Alliance for data
                                  (Defaults to '60').
  --tba-auth-key string           Your The Blue Alliance auth key.
  --tba-event-key string          The Blue Alliance event key for your current competition.
  -h, --help                      Display this usage guide.
```

## Recommendations

### Prevent database caching
At our first competition using eTech we had some minor little errors where some people would load old data. At the time the problem was unexplainable and didn't make sense. After the competition however, we figured out Cloudflare was caching database responses.

To fix this, add a cache bypass for any request to `/database/*`. For example, `etech.example.com/database/*` should bypass cache.

## Enable SSL
Create a folder in the same directory as server.js and call it `certs`

Inside this folder add these 3 certificates coresponding to their respective purposes

- server-key.pem
- server-crt.pem
- ca-crt.pem

Add `--use-ssl` or `-s` to your launch options. I recommend changing the listening port to 443 by using `--port 443` or `-p 443` in your launch options
