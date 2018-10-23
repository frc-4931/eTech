<template>
<div v-on:click="openTeam(team.number)" class="background-box background-box-hover leaderboard-team">
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
    homePage: Function,
    openTeam: Function
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
  computed: {
    totalPoints: function() {
      return this.team.commentPoints + this.team.objectivePoints;
    }
  },
  methods: {
    teamClicked: function() {
      this.$root.$emit("open-team", this.team.number);
    }
  }
};
</script>

<style>
</style>
