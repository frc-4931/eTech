<template>
  <div class="background-box admin-team">
    <div v-for="(teamEl, teamTitle) in team" v-bind:key="teamTitle">
      <p>{{ teamEl }}</p>
    </div>

    <div>
      <a @click="alert(removeTeam())">Remove Team</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminTeam",
  props: {
    teamdata: Object
  },
  methods: {
    removeTeam: function() {
      alert("TODO: remove team " + this.team.number);
    }
  },
  data: function() {
    return {
      team: {
        number: 1337,
        name: "Test Team"
      }
    };
  },
  created() {
    this.$set(this.team, "number", this.teamdata["number"]);
    this.$set(this.team, "name", this.teamdata["name"]);
  }
};
</script>

<style>
</style>
