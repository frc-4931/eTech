<template>
  <div
    v-if="loggedin"
    class="grid"
  >
    <FieldError v-if="error"></FieldError>

    <div class="location-centered-small grid-perminant">
      <h2 class=" background-box location-span content-centered">Add team</h2>

      <p class="location-left background-box content-centered">Team Name</p>

      <div class="location-right background-box-input">
        <input
          v-model.trim="name"
          type="text"
          name="team-name"
          placeholder="Team Name"
          class="content-centered"
        >
      </div>

      <p class="location-left background-box content-centered">Team Number</p>

      <div class="location-right background-box-input">
        <input
          v-model.number="number"
          type="number"
          pattern="[0-9]*"
          max="9999"
          min="1"
          name="team-number"
          placeholder="Team Number"
          class="content-centered"
        >
      </div>

      <div class="location-span">
        <h3
          @click="submitTeam()"
          class="background-box content-centered"
          v-bind:class="[this.allFieldsValid() ? 'background-box-hover' : 'background-box-disabled']"
        >Add</h3>

        <h3
          @click="goBack()"
          class="background-box background-box-hover content-centered"
        >Cancel</h3>
      </div>
    </div>
  </div>
  <Error v-else>You must be logged in as an admin to view this page!</Error>
</template>

<script>
import FieldError from "../scouting/FieldError.vue";
import Error from "../Error.vue";

export default {
  name: "MenuTeamAdd",
  components: {
    FieldError,
    Error
  },
  props: {
    localdb: Object,
    remotedb: Object
  },
  data: function() {
    return {
      number: "",
      name: "",
      error: false,
      loggedin: false
    };
  },
  methods: {
    submitTeam: function() {
      var dThis = this;
      if (this.allFieldsValid()) {
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
    },
    allFieldsValid() {
      return this.name.length !== 0 && this.number != 0;
    }
  },
  created() {
    var dThis = this;
    this.remotedb.getSession(function(err, response) {
      if (err) {
        //There was an error
      } else if (response.userCtx.roles.indexOf("_admin") != -1) {
        dThis.loggedin = true;
      }
    });
  }
};
</script>