<template>
  <div id="menu-admin">

    <div class="grid">
      <div @click="goBack()" class="background-box background-box-hover content-centered">
        <h3>Back</h3>
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

        <div id="leaderboard-container">
          <AdminTeam v-for="(teamData) in teams" v-bind:key="teamData['_id']" :teamdata="teamData" :removeteam="removeTeam"></AdminTeam>
        </div>
      </div>

      <div class="location-centered-small">
        <div class="background-box content-centered">
          <h2>Members</h2>
        </div>
      </div>

      <div class="location-right-small">
        <div class="background-box">
          <h2 class="content-centered">Tools</h2>
          <router-link :to="{name: 'team-add'}">Add team</router-link><br>
          <router-link :to="{name: 'admin-template'}">Edit Scouting Templates</router-link><br>
          <a @click="localdb.destroy()">Destroy All Data</a>
        </div>

        <div @click="goBack()" class="background-box background-box-hover content-centered">
          <h3>Back</h3>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import AdminTeam from "./admin/AdminTeam.vue";
import orderBy from "lodash.orderby";

export default {
  name: "MenuAdmin",
  components: {
    AdminTeam
  },
  props: {
    localdb: Object
  },
  data: function() {
    return {
      teams: []
    };
  },
  methods: {
    addToBoard(team_doc) {
      var teamID = team_doc["doc"]["_id"];
      if (teamID !== undefined) this.teams.push(team_doc["doc"]);
    },
    loadTeams() {
      this.teams = [];
      var dThis = this;
      this.localdb
        .allDocs({
          include_docs: true,
          startkey: "TEAM_0",
          endkey: "TEAM_\ufff0"
        })
        .then(function(result) {
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
    }
  },
  created: function() {
    this.loadTeams();
  }
};
</script>

<style>
.admin-team {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}
</style>