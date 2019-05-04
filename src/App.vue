<template>
  <div id="app">
    <NavigationDrawer
      :user="user"
      :navigationStatus="navigationStatus"
    />

    <TopBar
      :user="user"
      :navigationStatus="navigationStatus"
    />

    <Popup :popup="popup" />

    <ConnectionError v-if="isConnectionError" />

    <transition
      enter-active-class="content-fade-in"
      leave-active-class="content-fade-out"
      mode="out-in"
    >
      <keep-alive
        include="MenuHome,MenuAdmin"
        :max="5"
      >
        <router-view
          :HomeSortingOptions="HomeSortingOptions"
          :popup="popup"
          :localdb="localdb"
          :remotedb="remotedb"
          :localtbadb="localtbadb"
          :bluealliancedb="bluealliancedb"
          :sync_change="sync_change"
          :user="user"
          :reloadSync="reloadSync"
        ></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import ConnectionError from "./components/ConnectionError.vue";
import PouchDB from "pouchdb";
import Authentication from "pouchdb-authentication";
import NavigationDrawer from "./components/NavigationDrawer.vue";
import TopBar from "./components/TopBar.vue";
import Popup from "./components/Popup.vue";
import { Promise, async } from "q";

var url = "";
var setup = {};
var protocol = location.protocol == "https:" ? "https://" : "http://";
if (window.webpackHotUpdate) {
  url = protocol + window.location.hostname + ":5984/";
  setup = {
    skip_setup: true,
    fetch(url, opts) {
      opts.credentials = "include";
      return PouchDB.fetch(url, opts);
    }
  };
} else {
  url = protocol + window.location.host + "/database/";
  setup = {
    skip_setup: true
  };
}

export default {
  name: "app",
  components: {
    ConnectionError,
    TopBar,
    Popup,
    NavigationDrawer
  },
  data: function() {
    return {
      isConnectionError: false,
      navigationStatus: {
        active: false,
        backButton: false
      },
      HomeSortingOptions: {
        sortedTeamOption: "totalPoints",
        sortedTeamFlipped: false
      },
      popup: {
        newPopup: function() {},
        catchError: function() {}
      },
      localdb: new PouchDB("localdb"),
      remotedb: new PouchDB(url + "scouting", setup),
      bluealliancedb: new PouchDB(url + "bluealliance", setup),
      localtbadb: new PouchDB("localtbadb"),
      sync: {},
      tbasync: {},
      user: {
        username: null,
        role: null,
        online: null,
        logIn: this.logIn,
        logOut: this.logOut,
        getLoggedIn: this.getLoggedIn,
        changePassword: this.changePassword,
        scoutingHash: {
          hash: ""
        },
        tbaHash: {
          hash: ""
        }
      },
      sync_change: {
        onChange: function() {},
        onPaused: function() {},
        onBlueAllianceDbChange: function() {},
        onBlueAllianceDbPaused: function() {}
      }
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  methods: {
    setMethods(locDB, hashObj) {
      if (!locDB.putRAW) locDB.putRAW = locDB.put;
      if (!locDB.getRAW) locDB.getRAW = locDB.get;
      if (!locDB.allDocsRAW) locDB.allDocsRAW = locDB.allDocs;

      locDB.put = function(doc) {
        doc._id = hashObj.hash + doc._id;
        return locDB.putRAW(doc);
      };

      locDB.get = function(docID) {
        docID = hashObj.hash + docID;

        return new Promise((resolve, reject) => {
          locDB
            .getRAW(docID)
            .then(doc => {
              doc._id = doc._id.replace(hashObj.hash, "");
              resolve(doc);
            })
            .catch(reject);
        });
      };

      locDB.allDocs = function(opts) {
        opts.startkey = hashObj.hash + opts.startkey;
        opts.endkey = hashObj.hash + opts.endkey;

        return new Promise((resolve, reject) => {
          locDB
            .allDocsRAW(opts)
            .then(docs => {
              for (let doc of docs.rows) {
                doc.id = doc.id.replace(hashObj.hash, "");

                if (doc.doc)
                  doc.doc._id = doc.doc._id.replace(hashObj.hash, "");
              }
              resolve(docs);
            })
            .catch(reject);
        });
      };
    },
    loadHash(remDB, obj, nameString) {
      var dThis = this;
      return new Promise(resolve => {
        let tempGet = dThis[nameString].getRAW || dThis[nameString].get;

        remDB.get("DB_HASH").then(doc => {
          tempGet("LOCAL_DB_HASH")
            .then(locDoc => {
              if (locDoc.db_hash === doc.db_hash) {
                obj.hash = doc.db_hash + "_";
                dThis.setMethods(dThis[nameString], obj);
                resolve();
              } else {
                obj.hash = doc.db_hash + "_";
                // DB is not up to date and needs to be destroyed and repulled
                dThis[nameString].destroy().then(() => {
                  dThis[nameString] = new PouchDB(nameString);
                  dThis.setMethods(dThis[nameString], obj);
                  dThis[nameString]
                    .putRAW({
                      _id: "LOCAL_DB_HASH",
                      db_hash: doc.db_hash
                    })
                    .then(info => {
                      console.log(info);
                      resolve();
                    });
                });
              }
            })
            .catch(() => {
              obj.hash = doc.db_hash + "_";
              //No hash file, set hash file in local => destroy localdb repull.
              dThis[nameString].destroy().then(() => {
                dThis[nameString] = new PouchDB(nameString);
                dThis.setMethods(dThis[nameString], obj);
                dThis[nameString]
                  .putRAW({
                    _id: "LOCAL_DB_HASH",
                    db_hash: doc.db_hash
                  })
                  .then(() => {
                    resolve();
                  });
              });
            });
        });
      });
    },
    reloadSync: function() {
      var dThis = this;

      if (dThis.sync.removeAllListeners) dThis.sync.removeAllListeners();
      if (dThis.sync.cancel) dThis.sync.cancel();
      dThis.sync = dThis.localdb
        .sync(dThis.remotedb, {
          live: true,
          retry: true,
          heartbeat: 5000,
          filter: "general/filterbyhash"
        })
        .on("error", function(err) {
          console.log(err);
        })
        .on("change", function(change) {
          for (let doc of change.change.docs)
            doc._id = doc._id.replace(dThis.user.scoutingHash.hash, "");

          console.log(change);
          dThis.sync_change.onChange(change);
        })
        .on("paused", function() {
          dThis.sync_change.onPaused();
          dThis.getLoggedIn().catch(err => {
            console.log(err);
            if (
              err.status == 401 &&
              dThis.$router.currentRoute.name != "login"
            ) {
              dThis.$router.push({ name: "login" });
            }
          });
        });

      if (dThis.tbasync.removeAllListeners) dThis.tbasync.removeAllListeners();
      if (dThis.tbasync.cancel) dThis.tbasync.cancel();
      dThis.tbasync = dThis.localtbadb
        .sync(dThis.bluealliancedb, {
          live: true,
          retry: true,
          heartbeat: 5000,
          filter: "general/filterbyhash"
        })
        .on("error", function(err) {
          console.log(err);
        })
        .on("change", function(change) {
          for (let doc of change.change.docs)
            doc._id = doc._id.replace(dThis.user.scoutingHash.hash, "");

          dThis.sync_change.onBlueAllianceDbChange(change);
        })
        .on("paused", function() {
          dThis.sync_change.onBlueAllianceDbPaused();
        });
    },
    logIn(username, password) {
      var dThis = this;
      return new Promise((resolve, reject) => {
        dThis.remotedb.logIn(username.toLowerCase(), password, function(
          err,
          response
        ) {
          if (err) {
            dThis.user.username = null;
            dThis.user.role = null;
            dThis.user.online = null;

            if (err.name === "unauthorized" || err.name === "forbidden") {
              reject({
                status: 401,
                message: "Username or password is incorrect."
              });
            } else {
              reject({ status: 408, message: "Error, please try again." });
            }
          } else {
            //Login successful
            dThis.user.username = response.name;
            dThis.user.online = true;

            var roles = response.roles;
            if (roles.indexOf("_admin") !== -1) {
              dThis.user.role = "_admin";
            } else if (roles.indexOf("edit") !== -1) {
              dThis.user.role = "edit";
            } else if (roles.indexOf("view") !== -1) {
              dThis.user.role = "view";
            } else {
              dThis.user.role = null;
            }

            dThis.reloadSync();
            resolve(dThis.user);
          }
        });
      });
    },
    logOut() {
      var dThis = this;
      return new Promise((resolve, reject) => {
        dThis.remotedb.logOut(function(err) {
          if (err) {
            reject({ status: 408, message: "Error, please try again." });
          } else {
            dThis.user.username = null;
            dThis.user.role = null;
            dThis.user.online = null;

            dThis.sync = {};
            dThis.tbasync = {};

            resolve(dThis.user);
          }
        });
      });
    },
    getLoggedIn() {
      // .then( (isOnline, userObj) => {} )
      var dThis = this;
      return new Promise((resolve, reject) => {
        dThis.remotedb.getSession(function(err, response) {
          if (err) {
            console.log(err);

            var loggedin =
              dThis.user.username != null && dThis.user.role != null;

            //Status 0 == offline
            if (loggedin && err.status == 0) {
              dThis.user.online = false;
              resolve(false, dThis.user);
            } else
              reject({ status: 408, message: "Could not connect to server!" });
          } else if (!response.userCtx.name) {
            dThis.user.username = null;
            dThis.user.role = null;
            dThis.user.online = null;

            reject({ status: 401, message: "Logged out!" });
          } else {
            dThis.user.username = response.userCtx.name;
            dThis.user.online = true;

            var roles = response.userCtx.roles;
            if (roles.indexOf("_admin") !== -1) {
              dThis.user.role = "_admin";
            } else if (roles.indexOf("edit") !== -1) {
              dThis.user.role = "edit";
            } else if (roles.indexOf("view") !== -1) {
              dThis.user.role = "view";
            } else {
              dThis.user.role = null;
            }

            resolve(true, dThis.user);
          }
        });
      });
    },
    changePassword(username, password) {
      var dThis = this;
      return new Promise((resolve, reject) => {
        dThis.remotedb
          .changePassword(username, password)
          .then(resolve)
          .catch(err => {
            if (err.name === "not_found") {
              reject({ status: 404, message: "Could not find username." });
            } else {
              reject({ status: 403, message: "Failed to change password." });
            }
          });
      });
    },
    onRouteChange() {
      this.navigationStatus.backButton = this.$route.meta.backButton;
    }
  },
  created: function() {
    var dThis = this;

    PouchDB.plugin(Authentication);

    this.getLoggedIn()
      .then(isOnline => {
        if (isOnline)
          dThis
            .loadHash(dThis.remotedb, dThis.user.scoutingHash, "localdb")
            .then(() => {
              return dThis.loadHash(
                dThis.bluealliancedb,
                dThis.user.tbaHash,
                "localtbadb"
              );
            })
            .then(() => {
              console.log("INTIAL SYNC LOAD");
              dThis.reloadSync();
            });
      })
      .catch(err => {
        if (err.status == 401 && dThis.$router.currentRoute.name != "login") {
          dThis.$router.push({ name: "login" });
        }
      });

    this.onRouteChange();

    // Remove all beforeEach router calls and replace it with this one.
    this.$router.beforeHooks.splice(0, this.$router.beforeHooks.length);
    this.$router.beforeEach((to, from, next) => {
      var pageTitle = to.meta.title;

      if (to.params.number)
        pageTitle = pageTitle.replace("%s", to.params.number);
      if (to.params.username)
        pageTitle = pageTitle.replace("%s", to.params.username);

      document.title = "eTech: Scouting Done Right - " + pageTitle;

      console.log(dThis.user.role);
      next();
    });
  }
};
</script>

<style>
@import url("./css/normalize.css");
@import url("./css/style.css");
</style>