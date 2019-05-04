<template>
  <div>
    <Error v-if="user.role == null">You must be logged in to view this page!</Error>

    <div
      v-else
      class="grid"
    >
      <h1 class="background-box content-centered location-span">Schedule</h1>

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
            v-for="match in matches"
            :key="match.set_number + match.comp_level + match.match_number"
            :matchData="match"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>


<script>
import Error from "../Error.vue";
import orderBy from "lodash.orderby";
import ScheduleMatch from "./ScheduleMatch.vue";

export default {
  name: "MenuSchedule",
  components: {
    ScheduleMatch,
    Error
  },
  data: function() {
    return {
      matches: []
    };
  },
  props: {
    localtbadb: Object,
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

          //console.log(dThis.matches);
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