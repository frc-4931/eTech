<template>
  <div class="grid grid-shrink">
    <div
      class="location-centered"
      v-if="user.username != null && user.role != null"
    >
      <div class="background-box content-centered">
        <h2>Team Leaderboard</h2>
        <p>
          Teams are rated by combining various different pieces of
          information collected by team members.
        </p>
      </div>
      <div class="background-box">
        <input
          v-model.trim="filter"
          type="text"
          name="filter"
          placeholder="Search for teams..."
        >
      </div>
      <div
        v-if="teams.length != 0"
        class="background-box leaderboard-team leaderboard-container mobile-shrink"
      >
        <h3
          v-bind:class="
            HomeSortingOptions.sortedTeamOption === 'name'
              ? HomeSortingOptions.sortedTeamFlipped
                ? 'sorting-option-up sorting-option-selected'
                : 'sorting-option-down sorting-option-selected'
              : ''
          "
          @click="toggleSorted(true, 'name')"
        >Name</h3>
        <h3
          v-bind:class="
            HomeSortingOptions.sortedTeamOption === 'number'
              ? HomeSortingOptions.sortedTeamFlipped
                ? 'sorting-option-up sorting-option-selected'
                : 'sorting-option-down sorting-option-selected'
              : ''
          "
          @click="toggleSorted(true, 'number')"
        >Number</h3>
        <h3
          v-bind:class="
            HomeSortingOptions.sortedTeamOption === 'objectivePoints'
              ? HomeSortingOptions.sortedTeamFlipped
                ? 'sorting-option-up sorting-option-selected'
                : 'sorting-option-down sorting-option-selected'
              : ''
          "
          @click="toggleSorted(true, 'objectivePoints')"
        >Objective Points</h3>
        <h3
          v-bind:class="
            HomeSortingOptions.sortedTeamOption === 'commentPoints'
              ? HomeSortingOptions.sortedTeamFlipped
                ? 'sorting-option-up sorting-option-selected'
                : 'sorting-option-down sorting-option-selected'
              : ''
          "
          @click="toggleSorted(true, 'commentPoints')"
        >Comment Points</h3>
        <h3
          v-bind:class="
            HomeSortingOptions.sortedTeamOption === 'totalPoints'
              ? HomeSortingOptions.sortedTeamFlipped
                ? 'sorting-option-up sorting-option-selected'
                : 'sorting-option-down sorting-option-selected'
              : ''
          "
          @click="toggleSorted(true, 'totalPoints')"
        >Total Points</h3>
      </div>
      <p
        v-else
        class="location-centered background-box content-centered"
      >
        There aren't any teams to display yet.
        <br>Ask an admin to add teams.
      </p>

      <transition-group name="trans-group">
        <LeaderboardTeam
          v-for="teamData in filteredTeams"
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
import lodashOrderBy from "lodash.orderby";
import lodashFilter from "lodash.filter";

export default {
  name: "MenuMain",
  components: {
    LeaderboardTeam
  },
  props: {
    HomeSortingOptions: Object,
    localdb: Object,
    remotedb: Object,
    sync_change: Object,
    user: Object
  },
  data: function() {
    return {
      filter: "",
      teams: [],
      users: []
    };
  },
  methods: {
    sortTeamsByName() {
      this.teams = lodashOrderBy(
        this.teams,
        [
          function(team) {
            return team.name;
          },
          function(team) {
            return team.number;
          }
        ],
        ["asc", "asc"]
      );
    },
    sortTeamsByNumber() {
      this.teams = lodashOrderBy(
        this.teams,
        [
          function(team) {
            return team.number;
          },
          function(team) {
            return team.name;
          }
        ],
        ["asc", "desc"]
      );
    },
    sortTeamsByObjectivePoints() {
      this.teams = lodashOrderBy(
        this.teams,
        [
          function(team) {
            return team.objectivePoints;
          },
          function(team) {
            return team.number;
          }
        ],
        ["desc", "asc"]
      );
    },
    sortTeamsByCommentPoints() {
      this.teams = lodashOrderBy(
        this.teams,
        [
          function(team) {
            return team.commentPoints;
          },
          function(team) {
            return team.number;
          }
        ],
        ["desc", "asc"]
      );
    },
    sortTeamsByTotalPoints() {
      this.teams = lodashOrderBy(
        this.teams,
        [
          function(team) {
            return team.objectivePoints + team.commentPoints;
          },
          function(team) {
            return team.number;
          }
        ],
        ["desc", "asc"]
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

      if (sortingMethod != this.HomeSortingOptions.sortedTeamOption) {
        this.HomeSortingOptions.sortedTeamFlipped = false;
        this.HomeSortingOptions.sortedTeamOption = sortingMethod;
      } else if (reverse) {
        this.HomeSortingOptions.sortedTeamFlipped = !this.HomeSortingOptions
          .sortedTeamFlipped;
      }

      if (this.HomeSortingOptions.sortedTeamFlipped) this.teams.reverse();
    },
    loadTeams(sort) {
      var dThis = this;
      this.localdb
        .allDocsHASH({
          include_docs: true,
          startkey: "TEAM_",
          endkey: "TEAM_\ufff0"
        })
        .then(function(result) {
          var tempTeams = [];
          for (var docID in result["rows"]) {
            var teamID = result["rows"][docID]["doc"]["_id"];
            if (teamID !== undefined)
              tempTeams.push(result["rows"][docID]["doc"]);
          }

          if (sort) dThis.teams = tempTeams;
          dThis.toggleSorted(false, dThis.HomeSortingOptions.sortedTeamOption);
        });
    }
  },
  created() {
    var dThis = this;
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
    this.sync_change.onBlueAllianceDbChange = function() {
      //Do Nothing
    };
  },
  computed: {
    filteredTeams: function() {
      if (this.filter == "") return this.teams;

      var filterWords = this.filter.toLowerCase().split(" ");

      let shouldCombine = false;
      let index = 0;
      for (let i in filterWords) {
        let cur = filterWords[i];
        if (shouldCombine)
          filterWords[index] =
            filterWords[index] + " " + filterWords.splice(i, 1);

        if (cur.startsWith('"') || cur.startsWith('!"')) {
          shouldCombine = true;
          index = i;
        }
        if (cur.endsWith('"')) shouldCombine = false;
      }

      return lodashFilter(this.teams, function(team) {
        var shouldInclude = 0;
        filterWords.forEach(function(f) {
          let invert = false;
          let shouldInc = false;

          if (f.startsWith("!")) {
            f = f.replace("!", "");
            invert = true;
          }

          if (f.startsWith('"') && f.endsWith('"') && f.length >= 2) {
            f = f.substring(0, f.length - 1).replace('"', "");

            if (team.name.toLowerCase() == f || team.number.toString() == f)
              shouldInc = true;
          } else if (
            team.name.toLowerCase().includes(f) ||
            team.number.toString().includes(f)
          ) {
            shouldInc = true;
          }

          if (invert) shouldInc = !shouldInc;

          if (shouldInc) shouldInclude++;
        });

        return shouldInclude == filterWords.length;
      });
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