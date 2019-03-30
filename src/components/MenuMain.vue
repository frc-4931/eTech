<template>
  <div class="grid">
    <h1 class="content-centered location-span background-box">eTech: Scouting Done Right</h1>

    <div v-bind:class="[loggedin ? 'location-left-small' : 'location-centered-small']">
      <div class="grid">
        <AccountPanel
          :remotedb="remotedb"
          :sync_change="sync_change"
          :user="user"
          :reloadSync="reloadSync"
          @loggedin="loggedIn()"
          @loggedout="loggedOut()"
          class="location-span"
        ></AccountPanel>

        <div
          class="background-box location-span"
          v-if="loggedin"
        >
          <h2 class="content-centered">The Blue Alliance</h2>
          <div class="grid-perminant content-centered">
            <router-link
              class="location-left-small"
              :to="{name: 'ranking'}"
            >Rankings</router-link>
            <router-link
              class="location-centered-small"
              :to="{name: 'schedule'}"
            >Schedule</router-link>
            <router-link
              class="location-right-small"
              :to="{name: 'awards'}"
            >Awards</router-link>
          </div>
        </div>
      </div>
    </div>

    <div
      class="location-right-large"
      v-if="loggedin"
    >
      <div class="background-box content-centered">
        <h2>Team Leaderboard</h2>
        <p>
          Teams are given a rating by combining various different pieces of information collected by team
          members.
        </p>
      </div>
      <div
        v-if="teams.length != 0"
        class="background-box leaderboard-team leaderboard-container mobile-shrink"
      >
        <h3
          v-bind:class="sortedTeamOption === 'name' ? (sortedTeamFlipped ? 'sorting-option-up sorting-option-selected' : 'sorting-option-down sorting-option-selected') : ''"
          @click="toggleSorted(true, 'name')"
        >Name</h3>
        <h3
          v-bind:class="sortedTeamOption === 'number' ? (sortedTeamFlipped ? 'sorting-option-up sorting-option-selected' : 'sorting-option-down sorting-option-selected') : ''"
          @click="toggleSorted(true, 'number')"
        >Number</h3>
        <h3
          v-bind:class="sortedTeamOption === 'objectivePoints' ? (sortedTeamFlipped ? 'sorting-option-up sorting-option-selected' : 'sorting-option-down sorting-option-selected') : ''"
          @click="toggleSorted(true, 'objectivePoints')"
        >Objective Points</h3>
        <h3
          v-bind:class="sortedTeamOption === 'commentPoints' ? (sortedTeamFlipped ? 'sorting-option-up sorting-option-selected' : 'sorting-option-down sorting-option-selected') : ''"
          @click="toggleSorted(true, 'commentPoints')"
        >Comment Points</h3>
        <h3
          v-bind:class="sortedTeamOption === 'totalPoints' ? (sortedTeamFlipped ? 'sorting-option-up sorting-option-selected' : 'sorting-option-down sorting-option-selected') : ''"
          @click="toggleSorted(true, 'totalPoints')"
        >Total Points</h3>
      </div>
      <p
        v-else
        class="location-centered background-box content-centered"
      >There aren't any teams to display yet.
        <br>Ask an admin to add teams.
      </p>

      <transition-group name="trans-group">
        <LeaderboardTeam
          v-for="(teamData) in teams"
          v-bind:key="teamData['_id']"
          :teamdata="teamData"
          class="leaderboard-team"
        ></LeaderboardTeam>
      </transition-group>
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
      loggedin: false,
      sortedTeamOption: "totalPoints",
      sortedTeamFlipped: false
    };
  },
  methods: {
    sortTeamsByName() {
      this.teams = orderBy(
        this.teams,
        [
          function(team) {
            return team.name;
          },
          function(team) {
            return team.number;
          }
        ],
        ["desc", "desc"]
      ).reverse();
    },
    sortTeamsByNumber() {
      this.teams = orderBy(
        this.teams,
        [
          function(team) {
            return team.number;
          },
          function(team) {
            return team.name;
          }
        ],
        ["desc", "desc"]
      );
    },
    sortTeamsByObjectivePoints() {
      this.teams = orderBy(
        this.teams,
        [
          function(team) {
            return team.objectivePoints;
          },
          function(team) {
            return team.number;
          }
        ],
        ["desc", "desc"]
      );
    },
    sortTeamsByCommentPoints() {
      this.teams = orderBy(
        this.teams,
        [
          function(team) {
            return team.commentPoints;
          },
          function(team) {
            return team.number;
          }
        ],
        ["desc", "desc"]
      );
    },
    sortTeamsByTotalPoints() {
      this.teams = orderBy(
        this.teams,
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
    },
    toggleSorted(reverse, sortingMethod) {
      var dThis = this;

      var func;

      switch (sortingMethod) {
        case "name":
          func = dThis.sortTeamsByName;
          break;
        case "number":
          func = dThis.sortTeamsByNumber;
          break;
        case "objectivePoints":
          func = dThis.sortTeamsByObjectivePoints;
          break;
        case "commentPoints":
          func = dThis.sortTeamsByCommentPoints;
          break;
        case "totalPoints":
          func = dThis.sortTeamsByTotalPoints;
          break;
      }
      func();

      if (sortingMethod != this.sortedTeamOption) {
        this.sortedTeamFlipped = false;
        this.sortedTeamOption = sortingMethod;
      } else if (reverse) {
        this.sortedTeamFlipped = !this.sortedTeamFlipped;
      }

      if (this.sortedTeamFlipped) this.teams.reverse();
    },
    addToBoard(team_doc) {
      var teamID = team_doc["doc"]["_id"];
      if (teamID !== undefined) this.teams.push(team_doc["doc"]);
    },
    loadTeams(sort) {
      var dThis = this;
      this.localdb
        .allDocs({
          include_docs: true,
          startkey: "TEAM_",
          endkey: "TEAM_\ufff0"
        })
        .then(function(result) {
          dThis.teams = [];
          for (var docID in result["rows"]) {
            dThis.addToBoard(result["rows"][docID]);
          }

          if (sort) dThis.toggleSorted(false, dThis.sortedTeamOption);
        });
    },
    loggedIn() {
      var dThis = this;
      this.loggedin = true;
      this.loadTeams(true);

      this.sync_change.onChange = function(change) {
        if (change["direction"] == "pull") {
          var shouldLoadTeams = false;

          for (var doc of change.change.docs) {
            if (doc["_id"].startsWith("TEAM_")) {
              shouldLoadTeams = true;
            }
          }

          if (shouldLoadTeams) dThis.loadTeams(true);
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
.leaderboard-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  text-align: center;
}
.sorting-option-selected {
  font-weight: bold;
}
.sorting-option-selected::after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  margin-left: 5px;
  border-top: 8.66px solid transparent;
  border-bottom: 8.66px solid transparent;
  transition: 0.2s all ease-in-out;

  border-left: 10px solid var(--box-hover-color);
}
.sorting-option-up::after {
  transform: rotate(-90deg);
}
.sorting-option-down::after {
  transform: rotate(90deg);
}
</style>