<template>
  <div id="menu-admin">

    <div class="grid">
      <div class="location-span background-box content-centered">
        <h1>Admin Tools</h1>
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
          <AdminTeam v-for="(teamData) in teams" v-bind:key="teamData['_id']" :teamdata="teamData"></AdminTeam>
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
          <a @click="pages.toMenuAddTeam()">Add team</a><br>
          <a @click="pages.toMenuTemplateEditor()">Edit Scouting Templates</a><br>
          <a @click="localdb.destroy()">Destroy All Data</a>
        </div>

        <div @click="pages.toMenuMain()" class="background-box background-box-hover content-centered">
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
    pages: Object,
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
