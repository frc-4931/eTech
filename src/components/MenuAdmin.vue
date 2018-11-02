<template>
  <div id="menu-admin">

    <Error v-if="!isAdmin">You must be logged in as an admin to view this page!</Error>

    <div v-else class="grid">
      <div class="done-button-container location-left-tiny">
        <div @click="goBack()" class="background-box background-box-hover content-centered">
          <h3>Back</h3>
        </div>
      </div>

      <div class="location-centered background-box content-centered">
        <h2>Admin Tools</h2>
      </div>

      <div class="location-left-small">
        <div class="background-box content-centered">
          <h2>Teams</h2>
        </div>

        <div class="background-box admin-team">
          <p>Team Number</p>
          <p>Team Name</p>
          <p>Remove Team</p>
        </div>

        <AdminTeam v-for="(teamData) in teams" v-bind:key="teamData['_id']" :teamdata="teamData" :removeteam="removeTeam"></AdminTeam>
      </div>

      <div class="location-centered-small">
        <div class="background-box content-centered">
          <h2>Members</h2>
        </div>

        <div class="background-box admin-user">
          <p>Name</p>
          <p>Username</p>
          <p>Role</p>
          <p>Edit User</p>
        </div>

        <AdminUser v-for="user in users" :key="user.username" :userdata="user"></AdminUser>
      </div>

      <div class="location-right-small">
        <div class="background-box">
          <h2 class="content-centered">Tools</h2>
          <router-link :to="{name: 'team-add'}">Add Team</router-link><br>
          <router-link :to="{name: 'user-add'}">Add User</router-link><br>
          <router-link :to="{name: 'admin-template'}">Edit Scouting Templates</router-link><br>
          <a @click="localdb.destroy()">Destroy All Data</a>
        </div>

        <!-- <div @click="goBack()" class="background-box background-box-hover content-centered">
          <h3>Back</h3>
        </div> -->
      </div>
    </div>

  </div>
</template>

<script>
import AdminTeam from "./admin/AdminTeam.vue";
import AdminUser from "./admin/AdminUser.vue";
import orderBy from "lodash.orderby";
import Error from "./Error.vue";

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
      isAdmin: false
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
    goBack() {
      this.$router.go(-1);
    },
    loadUsers() {
      var dThis = this;

      this.localdb
        .get("USER_INDEX")
        .then(function(doc) {
          dThis.users = [];

          for (var i in doc.users) {
            var user = { username: i, name: doc.users[i], role: doc.roles[i] };

            dThis.users.push(user);
          }
        })
        .catch(function() {});
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
            var shouldLoadUsers = false;

            for (var doc of change.change.docs) {
              if (doc["_id"].startsWith("TEAM_")) {
                shouldLoadTeams = true;
              }

              if (doc["_id"] === "USER_INDEX") {
                shouldLoadUsers = true;
              }
            }

            if (shouldLoadTeams) dThis.loadTeams();
            if (shouldLoadUsers) dThis.loadUsers();
          }
        };
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