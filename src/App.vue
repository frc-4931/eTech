<template>
  <div id="app">
    <NavigationDrawer
      :user="user"
      :navigationDrawerStatus="navigationDrawerStatus"
    />

    <TopBar
      :user="user"
      :navigationDrawerStatus="navigationDrawerStatus"
    />

    <ConnectionError v-if="isConnectionError" />

    <transition
      enter-active-class="content-fade-in"
      leave-active-class="content-fade-out"
      mode="out-in"
    >
      <router-view
        :HomeSortingOptions="HomeSortingOptions"
        :localdb="localdb"
        :remotedb="remotedb"
        :localtbadb="localtbadb"
        :bluealliancedb="bluealliancedb"
        :sync_change="sync_change"
        :user="user"
        :reloadSync="reloadSync"
      ></router-view>
    </transition>
  </div>
</template>

<script>
import ConnectionError from "./components/ConnectionError.vue";
import PouchDB from "pouchdb";
import Authentication from "pouchdb-authentication";
import NavigationDrawer from "./components/NavigationDrawer.vue";
import TopBar from "./components/TopBar.vue";
import { resolve, reject } from "q";

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
    NavigationDrawer
  },
  data: function() {
    return {
      isConnectionError: false,
      navigationDrawerStatus: { active: false },
      HomeSortingOptions: {
        sortedTeamOption: "totalPoints",
        sortedTeamFlipped: false
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
        logIn: logIn,
        logOut: logOut,
        getLoggedIn: getLoggedIn
      },
      sync_change: {
        onChange: function() {},
        onPaused: function() {},
        onBlueAllianceDbChange: function() {},
        onBlueAllianceDbPaused: function() {},
        onLogin: function() {},
        onLogout: function() {}
      }
    };
  },
  methods: {
    reloadSync: function() {
      var dThis = this;

      dThis.sync = dThis.localdb
        .sync(dThis.remotedb, {
          live: true,
          retry: true
        })
        .on("error", function(err) {
          console.log(err);
        })
        .on("change", function(change) {
          dThis.sync_change.onChange(change);
        })
        .on("paused", function() {
          dThis.sync_change.onPaused();
        });

      dThis.tbasync = dThis.localtbadb
        .sync(dThis.bluealliancedb, {
          live: true,
          retry: true
        })
        .on("error", function(err) {
          console.log(err);
        })
        .on("change", function(change) {
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
            dThis.user.roll = null;

            if (err.name === "unauthorized" || err.name === "forbidden") {
              reject("Username or password is incorrect.");
            } else {
              reject("Error, please try again.");
            }
          } else {
            //Login successful
            console.log(response);
            resolve();
          }
        });
      });
    },
    logOut() {
      var dThis = this;
      return new Promise((resolve, reject) => {
        if (confirm("Are you sure you would like to log out?")) {
          dThis.remotedb.logOut(function(err) {
            if (err) {
              reject("Error, please try again.");
            } else {
              dThis.user.username = null;
              dThis.user.role = null;
              dThis.getLoggedIn();
              resolve();
            }
          });
        }
      });
    },
    getLoggedIn() {
      // .then( (isOnline, userObj) => {} )
      var dThis = this;
      return new Promise((resolve, reject) => {
        dThis.remotedb.getSession(function(err, response) {
          if (err) {
            var loggedin =
              dThis.user.username != null && dThis.user.role != null;

            if (loggedin) resolve(false, dThis.user);
            else
              reject({ status: 408, message: "Could not connect to server!" });
          } else if (!response.userCtx.name) {
            dThis.user.username = null;
            dThis.user.role = null;

            reject({ status: 401, message: "Logged out!" });
          } else {
            dThis.user.username = response.userCtx.name;

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
    }
  },
  created: function() {
    var dThis = this;

    PouchDB.plugin(Authentication);

    this.getLoggedIn().then(isOnline => {
      if (isOnline) dThis.reloadSync();
    });

    //this.reloadSync();
  }
};
</script>

<style>
@import url("./css/normalize.css");
@import url("./css/style.css");
</style>