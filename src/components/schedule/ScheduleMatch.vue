<template>
  <div class="background-box mobile-shrink schedule-match">
    <p>{{ match }}</p>
    <p
      @click="viewTeam(matchData.alliances.blue.team_keys[0])"
      :class="blueClass0"
    >{{ matchData.alliances.blue.team_keys[0].replace("frc", "") }}</p>
    <p
      @click="viewTeam(matchData.alliances.blue.team_keys[1])"
      :class="blueClass1"
    >{{ matchData.alliances.blue.team_keys[1].replace("frc", "") }}</p>
    <p
      @click="viewTeam(matchData.alliances.blue.team_keys[2])"
      :class="blueClass2"
    >{{ matchData.alliances.blue.team_keys[2].replace("frc", "") }}</p>
    <p
      @click="viewTeam(matchData.alliances.red.team_keys[0])"
      :class="redClass0"
    >{{ matchData.alliances.red.team_keys[0].replace("frc", "") }}</p>
    <p
      @click="viewTeam(matchData.alliances.red.team_keys[1])"
      :class="redClass1"
    >{{ matchData.alliances.red.team_keys[1].replace("frc", "") }}</p>
    <p
      @click="viewTeam(matchData.alliances.red.team_keys[2])"
      :class="redClass2"
    >{{ matchData.alliances.red.team_keys[2].replace("frc", "") }}</p>
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
    teamsMatched: Array
  },
  methods: {
    viewTeam: function(number) {
      this.$router.push({
        name: "team",
        params: { number: number.replace("frc", "") }
      });
    }
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
    blueClass0: function() {
      return (
        (this.matchData.winning_alliance == "blue"
          ? "schedule-match-blue"
          : "") +
        " " +
        (this.teamsMatched.indexOf(
          this.matchData.alliances.blue.team_keys[0].replace("frc", "")
        ) != -1
          ? "schedule-matched"
          : "")
      );
    },
    blueClass1: function() {
      return (
        (this.matchData.winning_alliance == "blue"
          ? "schedule-match-blue"
          : "") +
        " " +
        (this.teamsMatched.indexOf(
          this.matchData.alliances.blue.team_keys[1].replace("frc", "")
        ) != -1
          ? "schedule-matched"
          : "")
      );
    },
    blueClass2: function() {
      return (
        (this.matchData.winning_alliance == "blue"
          ? "schedule-match-blue"
          : "") +
        " " +
        (this.teamsMatched.indexOf(
          this.matchData.alliances.blue.team_keys[2].replace("frc", "")
        ) != -1
          ? "schedule-matched"
          : "")
      );
    },
    redClass0: function() {
      return (
        (this.matchData.winning_alliance == "red" ? "schedule-match-red" : "") +
        " " +
        (this.teamsMatched.indexOf(
          this.matchData.alliances.red.team_keys[0].replace("frc", "")
        ) != -1
          ? "schedule-matched"
          : "")
      );
    },
    redClass1: function() {
      return (
        (this.matchData.winning_alliance == "red" ? "schedule-match-red" : "") +
        " " +
        (this.teamsMatched.indexOf(
          this.matchData.alliances.red.team_keys[1].replace("frc", "")
        ) != -1
          ? "schedule-matched"
          : "")
      );
    },
    redClass2: function() {
      return (
        (this.matchData.winning_alliance == "red" ? "schedule-match-red" : "") +
        " " +
        (this.teamsMatched.indexOf(
          this.matchData.alliances.red.team_keys[2].replace("frc", "")
        ) != -1
          ? "schedule-matched"
          : "")
      );
    }
  }
};
</script>

<style>
.schedule-match {
  display: grid;
  grid-template-columns: 3fr repeat(6, 1fr) repeat(2, 1.5fr) 3fr;
  text-align: center;
  padding: 0px !important;
  padding: 0px !important;
}
.schedule-match p {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 2.5px;
  padding-right: 2.5px;
}
.schedule-match-blue {
  background-color: var(--tba-alliance-blue);
}
.schedule-match-red {
  background-color: var(--tba-alliance-red);
}
.schedule-matched {
  color: black;
  font-weight: 1000;
}
</style>
