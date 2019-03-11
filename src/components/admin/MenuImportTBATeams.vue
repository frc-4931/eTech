<template>
  <div class="grid grid-shrink">
    <div class="location-centered-small grid-perminant">
      <h2 class="background-box location-span content-centered">Import Teams from The Blue Alliance</h2>

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
import https from "https";

export default {
  name: "MenuImportTBATeams",
  components: {},
  props: {
    localdb: Object,
    remotedb: Object
  },
  data: function() {
    return {
      event: "",
      key: ""
    };
  },
  methods: {
    goBack() {
      this.$router.push("/admin/");
    },
    importTeams() {
      var dThis = this;

      if (this.allFieldsValid) {
        var options = {
          host: "www.thebluealliance.com",
          port: 443,
          path: "/api/v3/event/" + this.event + "/teams",
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": this.key
          }
        };

        var req = https.request(options, function(res) {
          res.setEncoding("utf8");
          res.on("data", function(chunk) {
            var data = JSON.parse(chunk);

            data.forEach(function(team) {
              console.log(
                "NAME: " + team.nickname + " NUMBER: " + team.team_number
              );

              var teamData = {
                name: team.nickname,
                number: parseInt(team.team_number),
                objectivePoints: 0,
                commentPoints: 0,
                _id: "TEAM_" + team.team_number
              };

              dThis.localdb.put(teamData);
            });
          });
        });

        req.on("error", function(err) {
          console.log("Eror with request to TBA: " + err.message);
        });

        req.end();
      }
    }
  },
  computed: {
    allFieldsValid() {
      return this.event.length != 0 && this.key.length == 64;
    }
  }
};
</script>
