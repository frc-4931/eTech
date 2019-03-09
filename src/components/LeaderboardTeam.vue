<template>
  <div
    @click="teamView()"
    class="background-box background-box-hover leaderboard-team"
  >
    <div
      v-for="(teamEl, teamTitle) in team"
      v-bind:key="teamTitle"
    >
      <p>{{ teamEl }}</p>
    </div>

    <p>{{ totalPoints }}</p>
  </div>
</template>

<script>
export default {
  name: "LeaderboardTeam",
  props: {
    teamdata: Object
  },
  data: function() {
    return {
      team: {
        name: "Error",
        number: -404,
        objectivePoints: -1,
        commentPoints: -1
      }
    };
  },
  methods: {
    teamView: function() {
      this.$router.push({
        name: "team",
        params: { number: this.team.number }
      });
    }
  },
  watch: {
    teamdata(val) {
      this.$set(this.team, "name", val["name"]);
      this.$set(this.team, "number", val["number"]);
      this.$set(this.team, "objectivePoints", val["objectivePoints"]);
      this.$set(this.team, "commentPoints", val["commentPoints"]);
    }
  },
  computed: {
    totalPoints: function() {
      return this.team.commentPoints + this.team.objectivePoints;
    }
  },
  created() {
    this.$set(this.team, "name", this.teamdata["name"]);
    this.$set(this.team, "number", this.teamdata["number"]);
    this.$set(this.team, "objectivePoints", this.teamdata["objectivePoints"]);
    this.$set(this.team, "commentPoints", this.teamdata["commentPoints"]);
  }
};
</script>