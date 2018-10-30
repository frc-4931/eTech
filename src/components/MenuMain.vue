<template>
  <div id="menu-main">
    <div class="grid">
      <div class="location-span background-box">
        <h1 class="content-centered">FRC 4931 Scouting App</h1>
      </div>
      <div class="location-left-large">
        <div class="background-box">
          <h2 class="content-centered">Team Leaderboard</h2>
          <p>
            Teams are given a rating by combining various different pieces of information collected by team
            members
          </p>
        </div>
        <div class="background-box leaderboard-team">
          <div>
            <p>Team Name</p>
          </div>
          <div>
            <p>Team Number</p>
          </div>
          <div>
            <p>Objective Points</p>
          </div>
          <div>
            <p>Comment Points</p>
          </div>
          <div>
            <p>Total Points</p>
          </div>
        </div>
        <div id="leaderboard-container">
          <LeaderboardTeam v-for="(teamData) in teams" v-bind:key="teamData['_id']" :teamdata="teamData"></LeaderboardTeam>
        </div>
      </div>
      <div class="location-right-small">
        <div class="background-box">
          <h2 class="content-centered">Account</h2>
          <router-link :to="{name: 'admin'}">Admin Page</router-link>
          <p>For this section I'm thinking it should be for info about the users account and if they have permision show options like the admin page</p>
        </div>
        <div class="background-box">
          <h2 class="content-centered">Member Leaderboard</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeaderboardTeam from "./LeaderboardTeam.vue";
import orderBy from "lodash.orderby";

export default {
  name: "MenuMain",
  components: {
    LeaderboardTeam
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
                return team.objectivePoints + team.commentPoints;
              },
              function(team) {
                return team.number;
              }
            ],
            ["desc", "desc"]
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
.leaderboard-team {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  text-align: center;
}
</style>