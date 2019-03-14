<template>
  <div class="grid">
    <div class="location-centered-small done-button-container">
      <h3
        @click="goBack()"
        class="background-box background-box-hover content-centered"
      >Back</h3>
    </div>

    <div class="location-span">
      <h1 class="background-box content-centered">Rankings</h1>

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

      <transition-group>
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
import RankingTeam from "./RankingTeam.vue";

export default {
  name: "MenuRanking",
  components: {
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
    sync_change: Object
  },
  methods: {
    reloadTeams() {
      var dThis = this;

      this.localtbadb.get("RANKINGS").then(function(doc) {
        dThis.teams = doc.json.rankings;
      });
    },
    goBack() {
      this.$router.push("/");
    }
  },
  created: function() {
    this.reloadTeams();

    this.sync_change.onBlueAllianceDbChange = function(change) {
      if (change["id"] === "RANKINGS") {
        this.reloadTeams();
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
