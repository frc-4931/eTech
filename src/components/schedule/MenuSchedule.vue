<template>
  <div>
    <Error v-if="user.role == null">You must be logged in to view this page!</Error>

    <div
      v-else
      class="grid"
    >
      <h1 class="background-box content-centered location-span">Schedule</h1>
      <div class="background-box location-span">
        <input
          v-model.trim="filter"
          type="text"
          name="filter"
          placeholder="Search for teams..."
        >
      </div>

      <div class="location-span">
        <div class="background-box ranking-team-container mobile-shrink schedule-match-description">
          <h3>Match</h3>
          <h3>Blue</h3>
          <h3>Red</h3>
          <h3>Score</h3>
          <h3>Time</h3>
        </div>

        <transition-group name="trans-group">
          <ScheduleMatch
            v-for="match in filteredMatches[0]"
            :key="match.set_number + match.comp_level + match.match_number"
            :matchData="match"
            :teamsMatched="filteredMatches[1]"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>


<script>
import Error from "../Error.vue";
import orderBy from "lodash.orderby";
import lodashFilter from "lodash.filter";
import ScheduleMatch from "./ScheduleMatch.vue";

export default {
  name: "MenuSchedule",
  components: {
    ScheduleMatch,
    Error
  },
  data: function() {
    return {
      matches: [],
      filter: "",
      teamNames: {}
    };
  },
  props: {
    localtbadb: Object,
    localdb: Object,
    sync_change: Object,
    user: Object
  },
  methods: {
    reloadMatches() {
      var dThis = this;

      this.localtbadb
        .allDocsHASH({
          include_docs: true,
          startkey: "MATCHSIMPLE_",
          endkey: "MATCHSIMPLE_\ufff0"
        })
        .then(function(result) {
          dThis.matches = [];
          for (let doc of result.rows) {
            dThis.matches.push(doc.doc.json);
          }

          dThis.matches = orderBy(
            dThis.matches,
            [
              function(match) {
                return match.time;
              }
            ],
            ["asc"]
          );

          dThis.localdb
            .allDocsHASH({
              include_docs: true,
              startkey: "TEAM_",
              endkey: "TEAM_\ufff0"
            })
            .then(docs => {
              for (let docID in docs["rows"]) {
                let doc = docs["rows"][docID]["doc"];
                dThis.$set(dThis.teamNames, doc.number.toString(), doc.name);
              }
            });
        });
    }
  },
  created: function() {
    var dThis = this;
    this.reloadMatches();

    this.sync_change.onBlueAllianceDbChange = function(change) {
      if (change["direction"] == "pull") {
        for (var doc of change["change"]["docs"]) {
          if (doc["_id"].startWith("MATCHSIMPLE_")) {
            dThis.reloadMatches();
          }
        }
      }
    };
  },
  computed: {
    filteredMatches: function() {
      // returns array [0] == Match list, [1] == List of teams matched
      let matchedTeams = [];
      let dThis = this;

      if (this.filter == "") return [this.matches, matchedTeams];

      let filterWords = this.filter.toLowerCase().split(" ");

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

      return [
        lodashFilter(this.matches, function(match) {
          let shouldInclude = 0;
          filterWords.forEach(function(f) {
            let invert = false;
            let shouldInc = false;

            if (f.startsWith("!")) {
              f = f.replace("!", "");
              invert = true;
            }

            let teams = match.alliances.red.team_keys.concat(
              match.alliances.blue.team_keys
            );
            teams.forEach((team, inx) => {
              teams[inx] = team.replace("frc", "");
            });

            for (let team of teams) {
              if (f.startsWith('"') && f.endsWith('"') && f.length >= 2) {
                let str = f.substring(0, f.length - 1).replace('"', "");

                if (team == str) {
                  shouldInc = true;
                  if (!matchedTeams.includes(team)) matchedTeams.push(team);
                } else if (
                  dThis.teamNames[team] &&
                  dThis.teamNames[team].toLowerCase() == str
                ) {
                  shouldInc = true;
                  if (!matchedTeams.includes(team)) matchedTeams.push(team);
                }
              } else if (team.includes(f)) {
                shouldInc = true;
                if (!matchedTeams.includes(team)) matchedTeams.push(team);
              } else if (
                dThis.teamNames[team] &&
                dThis.teamNames[team].toLowerCase().includes(f)
              ) {
                shouldInc = true;
                if (!matchedTeams.includes(team)) matchedTeams.push(team);
              }
            }

            if (invert) shouldInc = !shouldInc;

            if (shouldInc) shouldInclude++;
          });

          return shouldInclude == filterWords.length;
        }),
        matchedTeams
      ];
    }
  }
};
</script>

<style>
.schedule-match-description {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  text-align: center;
}
</style>