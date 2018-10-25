<template>
<div id="menu-team-add">
    <div class="grid">
        <div class="location-centered background-box">
            <h2 class="content-centered">Add team</h2>
        </div>

        <div class="location-left-padded background-box">
            <input v-model="name" type="text" name="team-name" placeholder="Team Name">
        </div>

        <div class="location-right-padded background-box">
            <input v-model="number" type="number" pattern="[0-9]*" max="9999" min="1" name="team-number" placeholder="Team Number">
        </div>

        <div v-on:click="submitTeam()" class="location-left-padded background-box background-box-hover content-centered">
          <h3>Add</h3>
        </div>
        <div v-on:click="pages.toMenuMain()" class="location-right-padded background-box background-box-hover content-centered">
          <h3>Cancel</h3>
        </div>

    </div>
</div>
</template>

<script>
export default {
  name: "MenuTeamAdd",
  props: {
    pages: Object,
    localdb: Object
  },
  data: function() {
    return {
      number: "",
      name: ""
    };
  },
  methods: {
    submitTeam: function() {
      var team = {
        name: this.name,
        number: parseInt(this.number),
        objectivePoints: 0,
        commentPoints: 0,
        _id: "TEAM_" + this.number
      };
      if (this.name != "" && this.number != "" && team.number != 0) {
        this.localdb.put(team);
      }
      this.pages.toMenuMain();
    }
  }
};
</script>

<style>
</style>
