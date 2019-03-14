<template>
  <div>
    <Error v-show="user.role != '_admin'">You must be logged in as an admin to view this page!</Error>
    <div
      v-show="user.role == '_admin'"
      class="grid grid-shrink"
    >
      <div class="location-centered-small grid-perminant">
        <h2 class=" background-box location-span content-centered">Add team</h2>

        <Error
          v-if="isError"
          class="location-span"
        >{{ errorMessage }}</Error>

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
            v-bind:class="[this.allFieldsValid ? 'background-box-hover' : 'background-box-disabled']"
          >Add</h3>

          <h3
            @click="goBack()"
            class="background-box background-box-hover content-centered"
          >Cancel</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "../Error.vue";

export default {
  name: "MenuTeamAdd",
  components: {
    Error
  },
  props: {
    localdb: Object,
    remotedb: Object,
    user: Object
  },
  data: function() {
    return {
      number: "",
      name: "",
      isError: false,
      errorMessage: "Error"
    };
  },
  methods: {
    submitTeam: function() {
      var dThis = this;
      if (this.allFieldsValid) {
        var team = {
          name: this.name,
          number: parseInt(this.number),
          objectivePoints: 0,
          commentPoints: 0,
          _id: "TEAM_" + this.number
        };

        this.localdb
          .put(team)
          .then(function() {
            dThis.goBack();
          })
          .catch(function(err) {
            if (err.name === "conflict") {
              dThis.isError = true;
              dThis.errorMessage =
                "There was a conflict when adding team! Maybe the team number is already used?";
            } else {
              dThis.isError = true;
              dThis.errorMessage = "An unknown error occurred";
            }
          });
      }
    },
    goBack() {
      this.$router.push("/admin/");
    }
  },
  computed: {
    allFieldsValid() {
      return this.name.length !== 0 && this.number > 0;
    }
  }
};
</script>