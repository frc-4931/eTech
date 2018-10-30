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

        <div v-if="this.teams.length == 0" class="grid">
          <div class="location-centered background-box content-centered">
            <h3>
              There aren't any teams to display<br>
              Click
              <router-link :to="{name: 'team-add'}">here</router-link> to add a team</h3>
          </div>
        </div>
      </div>
      <div class="location-right-small">
        <AccountPanel :remotedb="remotedb"></AccountPanel>
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
import AccountPanel from "./user/AccountPanel.vue";

export default {
  name: "MenuMain",
  components: {
    LeaderboardTeam,
    AccountPanel
  },
  props: {
    localdb: Object,
    remotedb: Object,
    sync: Object
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
          dThis.teams = [];
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
    var dThis = this;
    this.loadTeams();

    this.sync.on("change", function(change) {
      if (change["direction"] == "pull") {
        var shouldLoadTeams = false;

        for (var doc of change.change.docs) {
          if (doc["_id"].startsWith("TEAM_")) {
            shouldLoadTeams = true;
          }
        }

        if (shouldLoadTeams) dThis.loadTeams();
      }
    });
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