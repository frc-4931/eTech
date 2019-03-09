<template>
  <div id="app">
    <transition
      enter-active-class="content-fade-in"
      leave-active-class="content-fade-out"
      mode="out-in"
    >
      <router-view
        :localdb="localdb"
        :remotedb="remotedb"
        :sync_change="sync_change"
        :user="user"
        :reloadSync="reloadSync"
      ></router-view>
    </transition>

    <ConnectionError v-if="isConnectionError"></ConnectionError>
  </div>
</template>

<script>
import ConnectionError from "./components/ConnectionError.vue";
import PouchDB from "pouchdb";
import Authentication from "pouchdb-authentication";

var url = "";
var setup = {};
var protocol = location.protocol == "https:" ? "https://" : "http://";
if (window.webpackHotUpdate) {
  url = protocol + window.location.hostname + ":5984/scouting/";
  setup = {
    skip_setup: true,
    fetch(url, opts) {
      opts.credentials = "include";
      return PouchDB.fetch(url, opts);
    }
  };
} else {
  url = protocol + window.location.host + "/database/scouting";
  setup = {
    skip_setup: true
  };
}

export default {
  name: "app",
  components: {
    ConnectionError
  },
  data: function() {
    return {
      isConnectionError: false,
      localdb: new PouchDB("localdb"),
      remotedb: new PouchDB(url, setup),
      sync: {},
      user: { username: null, role: null },
      sync_change: { onChange: function() {}, onPaused: function() {} }
    };
  },
  methods: {
    reloadSync() {
      //console.log("Reloading sync");
      var dThis = this;

      this.sync.cancel();

      dThis.sync = dThis.localdb
        .sync(dThis.remotedb, {
          live: true,
          retry: true
        })
        .on("error", function(err) {
          dThis.console.log(err);
        })
        .on("change", function(change) {
          dThis.sync_change.onChange(change);
        })
        .on("paused", function() {
          dThis.sync_change.onPaused();
        });
    }
  },
  created: function() {
    PouchDB.plugin(Authentication);

    var dThis = this;

    this.remotedb.getSession(function(err, response) {
      if (err) {
        //Error
      } else if (!response.userCtx.name) {
        dThis.user.username = null;
        dThis.user.role = null;
      } else {
        var roles = response.userCtx.roles;
        dThis.$set(dThis.user, "username", response.userCtx.name);

        if (roles.indexOf("_admin") !== -1) {
          dThis.$set(dThis.user, "role", "_admin");
        } else if (roles.indexOf("edit") !== -1) {
          dThis.$set(dThis.user, "role", "edit");
        } else if (roles.indexOf("view") !== -1) {
          dThis.$set(dThis.user, "role", "view");
        }
      }
    });

    this.sync = this.localdb
      .sync(this.remotedb, {
        live: true,
        retry: true
      })
      .on("error", function(err) {
        dThis.console.log(err);
      })
      .on("change", function(change) {
        dThis.sync_change.onChange(change);
      })
      .on("paused", function() {
        dThis.sync_change.onPaused();
      });
  }
};
</script>

<style>
@import url("./css/normalize.css");
@import url("./css/style.css");
</style>