<template>
  <div class="background-box admin-team">
    <div v-for="(teamEl, teamTitle) in team" v-bind:key="teamTitle">
      <p>{{ teamEl }}</p>
    </div>

    <div>
      <a @click="removeteam(team.number)">Remove Team</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminTeam",
  props: {
    teamdata: Object,
    removeteam: Function
  },
  data: function() {
    return {
      team: {
        number: -404,
        name: "Error: Failed To Load"
      }
    };
  },
  methods: {},
  created() {
    this.$set(this.team, "number", this.teamdata["number"]);
    this.$set(this.team, "name", this.teamdata["name"]);
  }
};
</script>