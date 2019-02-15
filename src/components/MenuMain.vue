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
          <LeaderboardTeam
            v-for="(teamData) in teams"
            v-bind:key="teamData['_id']"
            :teamdata="teamData"
          ></LeaderboardTeam>
        </div>

        <div
          v-if="teams.length == 0"
          class="grid"
        >
          <div class="location-centered background-box content-centered">
            <h3 v-if="loggedin">
              There aren't any teams to display<br>
              Ask an admin to add teams.
            </h3>
            <h3 v-else>
              You must be logged in to view teams!
            </h3>
          </div>
        </div>
      </div>
      <div class="location-right-small">
        <AccountPanel
          :remotedb="remotedb"
          :sync_change="sync_change"
          :user="user"
          :reloadSync="reloadSync"
          @loggedin="loggedIn()"
          @loggedout="loggedOut()"
        ></AccountPanel>
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
    sync_change: Object,
    user: Object,
    reloadSync: Function
  },
  data: function() {
    return {
      teams: [],
      users: [],
      loggedin: false
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
    },
    loggedIn() {
      var dThis = this;
      this.loggedin = true;
      this.loadTeams();

      this.sync_change.onChange = function(change) {
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
    },
    loggedOut() {
      this.teams = [];
      this.loggedin = false;

      this.sync_change.onChange = function() {
        // Do nothing
      };
    }
  },
  created: function() {
    if (
      this.user.role === "_admin" ||
      this.user.role === "edit" ||
      this.user.role === "view"
    ) {
      this.loggedIn();
    }
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