<template>
  <div class="background-box mobile-shrink schedule-match">
    <p>{{ matchData.match_number}}</p>
    <p class="schedule-match-blue">{{ matchData.alliances.blue.team_keys[0] }}</p>
    <p class="schedule-match-blue">{{ matchData.alliances.blue.team_keys[1] }}</p>
    <p class="schedule-match-blue">{{ matchData.alliances.blue.team_keys[2] }}</p>
    <p class="schedule-match-red">{{ matchData.alliances.red.team_keys[0] }}</p>
    <p class="schedule-match-red">{{ matchData.alliances.red.team_keys[1] }}</p>
    <p class="schedule-match-red">{{ matchData.alliances.red.team_keys[2] }}</p>
    <p>{{ matchData.score_breakdown.blue.totalPoints }}</p>
    <p>{{ matchData.score_breakdown.red.totalPoints }}</p>
    <p>{{ scheduledTime }}</p>
  </div>
</template>

<script>
export default {
  name: "RankingTeam",
  props: {
    matchData: Object,
    localtbadb: Object,
    localdb: Object
  },
  computed: {
    scheduledTime: function() {
      return new Date(this.matchData.time).toLocaleTimeString();
    }
  }
};
</script>

<style>
.schedule-match {
  display: grid;
  grid-template-columns: 3fr repeat(6, 1fr) repeat(2, 1.5fr) 3fr;
  text-align: center;
}
.schedule-match-blue {
  background-color: blue;
}
.schedule-match-red {
  background-color: red;
}
</style>
