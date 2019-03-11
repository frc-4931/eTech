<template>
  <Error v-if="!loggedin">You must be logged in as an admin to view this page</Error>

  <div
    v-else
    class="grid grid-shrink"
  >
    <div class="location-centered-small grid-perminant">
      <h2 class="background-box location-span content-centered">Import Teams From The Blue Alliance</h2>

      <Error
        v-if="isError"
        class="location-span"
      >{{ errorMessage }}</Error>

      <p class="location-left background-box content-centered">Event ID</p>

      <div class="location-right background-box-input">
        <input
          v-model="event"
          type="text"
          name="event-id"
          placeholder="Event ID"
          class="content-centered"
        >
      </div>

      <p class="location-left background-box content-centered">Auth Key</p>

      <div class="location-right background-box-input">
        <input
          v-model="key"
          type="text"
          name="auth-key"
          placeholder="Auth Key"
          class="content-centered"
        >
      </div>

      <div class="location-span">
        <h3
          @click="importTeams()"
          class="background-box content-centered"
          v-bind:class="[this.allFieldsValid ? 'background-box-hover' : 'background-box-disabled']"
        >Import</h3>

        <h3
          @click="goBack()"
          class="background-box background-box-hover content-centered"
        >Cancel</h3>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "../Error.vue";
import https from "https";

export default {
  name: "MenuImportTBATeams",
  components: { Error },
  props: {
    localdb: Object,
    remotedb: Object
  },
  data: function() {
    return {
      event: "",
      key: "",
      loggedin: false,
      isError: false,
      errorMessage: ""
    };
  },
  methods: {
    goBack() {
      this.$router.push("/admin/");
    },
    importTeams() {
      var dThis = this;

      if (this.allFieldsValid) {
        this.isError = false;

        var options = {
          host: "www.thebluealliance.com",
          port: 443,
          path: "/api/v3/event/" + this.event + "/teams",
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": this.key
          }
        };

        var request = https.request(options, function(res) {
          var data;

          res.setEncoding("utf8");
          res.on("data", function(chunk) {
            console.log(chunk);
            data = JSON.parse(chunk);
          });

          res.on("end", function() {
            if (res.statusCode == 404) {
              dThis.isError = true;
              dThis.errorMessage =
                "TBA returned a 404 response code. '" +
                dThis.event +
                "' is probably not a valid event.";
            }

            if (res.statusCode == 401) {
              dThis.isError = true;
              dThis.errorMessage =
                "TBA returned a 401 response code. '" +
                dThis.key +
                "' is probably not a valid key.";
            }

            if (!dThis.isError) {
              data.forEach(function(team) {
                var teamData = {
                  name: team.nickname,
                  number: team.team_number,
                  objectivePoints: 0,
                  commentPoints: 0,
                  _id: "TEAM_" + team.team_number
                };

                dThis.localdb.put(teamData).catch(function(err) {
                  dThis.isError = true;
                  if (err.name === "conflict") {
                    dThis.errorMessage =
                      "Team '" + team.nickname + "' is already imported";
                  } else {
                    dThis.errorMessage = "An unknown error occurred";
                  }
                });
              });
            }
          });
        });

        request.on("error", function(err) {
          dThis.isError = true;
          dThis.errorMessage =
            "Error while importing teams from TBA: " + err.message;
        });

        request.end();
      }
    }
  },
  computed: {
    allFieldsValid() {
      return this.event.length >= 8 && this.key.length == 64;
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
