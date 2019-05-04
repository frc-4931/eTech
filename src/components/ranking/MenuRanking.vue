<template>
  <Error v-if="user.role == null">You must be logged in to view this page!</Error>

  <div
    v-else
    class="grid"
  >
    <h1 class="background-box content-centered location-span">Rankings</h1>

    <div class="location-span">
      <div class="background-box ranking-team-container mobile-shrink">
        <h3>Ranking</h3>
        <h3>Name</h3>
        <h3>Number</h3>
        <h3>Wins</h3>
        <h3>Losses</h3>
        <h3>Ties</h3>
        <h3>Win Percentage</h3>
        <h3>Ranking Points</h3>
      </div>

      <transition-group name="trans-group">
        <RankingTeam
          v-for="team in teams"
          :key="team.team_key"
          :teamData="team"
          :localtbadb="localtbadb"
          :localdb="localdb"
        />
      </transition-group>
    </div>
  </div>
</template>


<script>
import Error from "../Error.vue";
import RankingTeam from "./RankingTeam.vue";

export default {
  name: "MenuRanking",
  components: {
    Error,
    RankingTeam
  },
  data: function() {
    return {
      teams: []
    };
  },
  props: {
    localtbadb: Object,
    localdb: Object,
    sync_change: Object,
    user: Object
  },
  methods: {
    reloadTeams() {
      var dThis = this;

      this.localtbadb.getHASH("RANKINGS").then(function(doc) {
        dThis.teams = doc.json.rankings;
      });
    }
  },
  created: function() {
    var dThis = this;
    this.reloadTeams();

    this.sync_change.onBlueAllianceDbChange = function(change) {
      if (change["direction"] == "pull") {
        for (var doc of change["change"]["docs"]) {
          if (doc["_id"] === "RANKINGS") {
            dThis.reloadTeams();
          }
        }
      }
    };
  }
};
</script>

<style>
.ranking-team-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  text-align: center;
}
</style>
