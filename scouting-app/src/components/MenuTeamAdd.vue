<template>
<div id="menu-team-add" class="popup-closed">
    <div class="grid">
        <div class="location-centered background-box">
            <h2 class="content-centered">Add team</h2>
        </div>

        <div class="location-left-padded background-box">
            <input type="text" name="team-name" placeholder="Team Name">
        </div>

        <div class="location-right-padded background-box">
            <input type="number" pattern="[0-9]*" max="9999" min="1" name="team-number" placeholder="Team Number">
        </div>

        <div class="location-centered background-box"><input type="button" value="Submit" v-on:click="homePage"></div>

    </div>
</div>
</template>

<script>
export default {
  name: "MenuTeamAdd",
  props: {
    homePage: Function
  },
  methods: {
    submitTeam: function() {
      //TODO
      homePage();
    }
  }
};
</script>
