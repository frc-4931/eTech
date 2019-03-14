<template>
  <div class="background-box mobile-shrink schedule-match">
    <p>{{ match }}</p>
    <p :class="blueClass">{{ matchData.alliances.blue.team_keys[0].replace("frc", "") }}</p>
    <p :class="blueClass">{{ matchData.alliances.blue.team_keys[1].replace("frc", "") }}</p>
    <p :class="blueClass">{{ matchData.alliances.blue.team_keys[2].replace("frc", "") }}</p>
    <p :class="redClass">{{ matchData.alliances.red.team_keys[0].replace("frc", "") }}</p>
    <p :class="redClass">{{ matchData.alliances.red.team_keys[1].replace("frc", "") }}</p>
    <p :class="redClass">{{ matchData.alliances.red.team_keys[2].replace("frc", "") }}</p>
    <p>{{ matchData.alliances.blue.score }}</p>
    <p>{{ matchData.alliances.red.score }}</p>
    <p>{{ scheduledTime }}</p>
  </div>
</template>

<script>
export default {
  name: "ScheduleMatch",
  props: {
    matchData: Object,
    localtbadb: Object,
    localdb: Object
  },
  computed: {
    scheduledTime: function() {
      var d = new Date(0);
      d.setUTCSeconds(this.matchData.time);
      return d.toLocaleString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    match: function() {
      var comp = "Qual ";
      if (this.matchData.comp_level == "f") comp = "Final ";
      else if (this.matchData.comp_level == "sf")
        comp = "SF " + this.matchData.set_number + " - ";
      else if (this.matchData.comp_level == "qf")
        comp = "QF " + this.matchData.set_number + " - ";

      return comp + this.matchData.match_number;
    },
    redClass: function() {
      return this.matchData.winning_alliance == "red"
        ? "schedule-match-red"
        : "";
    },
    blueClass: function() {
      return this.matchData.winning_alliance == "blue"
        ? "schedule-match-blue"
        : "";
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
