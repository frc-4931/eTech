<template>
  <div id="menu-team-add">
    <div class="grid">
      <FieldError v-if="error"></FieldError>

      <div v-else class="location-centered background-box">
        <h2 class="content-centered">Add team</h2>
      </div>

      <div class="location-left-padded background-box">
        <input v-model="name" type="text" name="team-name" placeholder="Team Name">
      </div>

      <div class="location-right-padded background-box">
        <input v-model="number" type="number" pattern="[0-9]*" max="9999" min="1" name="team-number" placeholder="Team Number">
      </div>

      <div @click="submitTeam()" class="location-left-padded background-box background-box-hover content-centered">
        <h3>Add</h3>
      </div>
      <div @click="goBack()" class="location-right-padded background-box background-box-hover content-centered">
        <h3>Cancel</h3>
      </div>

    </div>
  </div>
</template>

<script>
import FieldError from "./scouting/FieldError.vue";

export default {
  name: "MenuTeamAdd",
  components: {
    FieldError
  },
  props: {
    localdb: Object
  },
  data: function() {
    return {
      number: "",
      name: "",
      error: false
    };
  },
  methods: {
    submitTeam: function() {
      var dThis = this;
      if (this.name != "" && this.number != "" && this.number != 0) {
        var team = {
          name: this.name,
          number: parseInt(this.number),
          objectivePoints: 0,
          commentPoints: 0,
          _id: "TEAM_" + this.number
        };

        this.localdb.put(team).then(function() {
          dThis.goBack();
        });
      } else {
        this.error = true;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style>
</style>
