<template>
<div id="menu-main">
    <div class="grid">
        <div class="location-span background-box">
            <h1 class="content-centered">FRC 4931 Scouting app</h1>
            <p>This is my (Damian) scouting application for FRC 4931. It's only a proof of concept at this state</p>
        </div>

        <div class="location-left-large">
            <div class="background-box">
                <h2 class="content-centered">Leaderboard</h2>
                <p>Teams are given a rating by combining various different pieces of information collected by team
                    members</p>
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
                <LeaderboardTeam v-for="(teamData) in teams" v-bind:key="teamData['_id']" :teamdata="teamData" :pages="pages"></LeaderboardTeam>
            </div>
        </div>

        <div class="location-right-small">
            <div class="background-box">
                <h2 class="content-centered">Tools</h2>
                <a @click="pages.toMenuAddTeam()">Add team</a>
                <p>Remove team</p>
                <a @click="pages.toMenuAdmin()">Admin Page</a><br>
                <a @click="localdb.destroy()">Destroy All Data</a>
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
</style>
