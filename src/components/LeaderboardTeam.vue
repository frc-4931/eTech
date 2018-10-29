<template>
  <div @click="teamView()" class="background-box background-box-hover leaderboard-team">
    <div v-for="(teamEl, teamTitle) in team" v-bind:key="teamTitle">
      <p>{{ teamEl }}</p>
    </div>

    <div>
      <p>{{ totalPoints }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeaderboardTeam",
  props: {
    pages: Object,
    teamdata: Object
  },
  data: function() {
    return {
      team: {
        name: "Test Team",
        number: 1337,
        objectivePoints: 7,
        commentPoints: 5
      }
    };
  },
  methods: {
    teamView: function() {
      this.pages.toMenuTeamView(this.team.number);
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

<style>
</style>
