<template>
  <Error v-if="!isAdmin">You must be logged in as an admin to view this page!</Error>

  <div v-else class="grid">
    <h2 class="location-span background-box content-centered">Admin Tools</h2>

    <div class="location-left-small">
      <h2 class="content-centered background-box">Tools</h2>

      <div class="background-box">
        <router-link :to="{name: 'user-add'}">Add User</router-link>
        <br>
        <router-link :to="{name: 'admin-template'}">Edit Scouting Templates</router-link>
        <br>
      </div>
    </div>

    <div class="location-centered-small">
      <h2 class="background-box content-centered">Teams</h2>

      <div v-if="teams.length != 0" class="background-box admin-team">
        <p>Team Number</p>
        <p>Team Name</p>
        <p>Remove Team</p>
      </div>

      <div v-else class="location-centered background-box content-centered">
        <p>There aren't any teams to display.</p>
      </div>

      <transition-group name="trans-group">
        <AdminTeam v-for="(teamData) in teams" v-bind:key="teamData['_id']" :teamdata="teamData" :removeteam="removeTeam"/>
      </transition-group>
    </div>

    <div class="location-right-small">
      <h2 class="background-box content-centered">Members</h2>

      <div v-if="users.length != 0" class="background-box admin-user">
        <p>Name</p>
        <p>Username</p>
        <p>Role</p>
        <p>Edit User</p>
      </div>

      <div v-else class="background-box content-centered">
        <p>There aren't any users to display yet.</p>
        <router-link :to="{name: 'user-add'}">Add a user here.</router-link>
      </div>

      <transition-group name="trans-group">
        <AdminUser v-for="user in users" :key="user.username" :userdata="user"></AdminUser>
      </transition-group>
    </div>
  </div>
</template>

<script>
import AdminTeam from "./admin/AdminTeam.vue";
import AdminUser from "./admin/AdminUser.vue";
import orderBy from "lodash.orderby";
import Error from "./Error.vue";
import PouchDB from "pouchdb";

// Setup for running dev server
var url = "";
var setup = {};
var protocol = location.protocol == "https:" ? "https://" : "http://";
if (window.webpackHotUpdate) {
  url = protocol + window.location.hostname + ":5984/_users/";
  setup = {
    fetch(url, opts) {
      opts.credentials = "include";
      return PouchDB.fetch(url, opts);
    }
  };
} else {
  url = protocol + window.location.host + "/database/_users";
  setup = {};
}

export default {
  name: "MenuAdmin",
  components: {
    AdminTeam,
    AdminUser,
    Error
  },
  props: {
    localdb: Object,
    remotedb: Object,
    sync_change: Object
  },
  data: function() {
    return {
      teams: [],
      users: [],
      isAdmin: true,
      usersdb: new PouchDB(url, setup)
    };
  },
  methods: {
    addToBoard(team_doc) {
      var teamID = team_doc["doc"]["_id"];
      if (teamID !== undefined) this.teams.push(team_doc["doc"]);
    },
    loadTeams() {
      var dThis = this;
      this.localdb
        .allDocs({
          include_docs: true,
          startkey: "TEAM_0",
          endkey: "TEAM_\ufff0"
        })
        .then(function(result) {
          dThis.teams = [];
          for (var docID in result["rows"]) {
            dThis.addToBoard(result["rows"][docID]);
          }
          dThis.teams = orderBy(
            dThis.teams,
            [
              function(team) {
                return team.number;
              }
            ],
            ["asc"]
          );
        });
    },
    removeTeam(number) {
      var shouldDelete = confirm(
        "Are you sure you want to delete team #" +
          number +
          "?\n There's no going back!"
      );

      if (shouldDelete) {
        var dThis = this;
        this.localdb.get("TEAM_" + number).then(function(doc) {
          dThis.localdb.remove(doc).then(function() {
            dThis.loadTeams();
          });
        });
      }
    },
    loadUsers() {
      var dThis = this;

      this.usersdb
        .allDocs({
          include_docs: true,
          startkey: "org.couchdb.user",
          endkey: "org.couchdb.user\ufff0"
        })
        .then(function(docs) {
          dThis.users = [];

          for (var i in docs["rows"]) {
            var doc = docs["rows"][i]["doc"];

            var user = {
              username: doc.name,
              name: doc.realName,
              role: doc.roles[0]
            };

            dThis.users.push(user);
          }
        });
    }
  },
  created: function() {
    var dThis = this;

    this.remotedb.getSession(function(err, response) {
      if (err) {
        //There was an error
      } else if (response.userCtx.roles.indexOf("_admin") !== -1) {
        dThis.isAdmin = true;

        dThis.loadTeams();
        dThis.loadUsers();

        dThis.sync_change.onChange = function(change) {
          if (change["direction"] == "pull") {
            var shouldLoadTeams = false;

            for (var doc of change.change.docs) {
              if (doc["_id"].startsWith("TEAM_")) {
                shouldLoadTeams = true;
              }
            }

            if (shouldLoadTeams) dThis.loadTeams();
          }
        };

        dThis.usersdb
          .changes({
            since: "now",
            live: true,
            include_docs: true
          })
          .on("change", function(change) {
            if (change["id"].startsWith("org.couchdb.user")) dThis.loadUsers();
          })
          .on("error", function(err) {
            console.log(err);
          });
      } else {
        // You must be logged in as an admin
        dThis.isAdmin = false;
      }
    });
  }
};
</script>

<style>
.admin-team {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}
.admin-user {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
}
</style>