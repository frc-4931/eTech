<template>
  <Error v-if="user.role == null">You must be logged in to view this page!</Error>

  <div
    v-else
    class="grid grid-shrink"
  >
    <h1 class="location-centered background-box content-centered">Awards</h1>

    <div
      v-if="awards.length > 0"
      class="location-centered"
    >
      <div class="tba-awards-container background-box">
        <h3>Award</h3>
        <h3>Winner</h3>
      </div>

      <transition-group name="trans-group">
        <AwardsWinner
          v-for="award in awards"
          :key="award.award_type"
          :winnerData="award"
        />
      </transition-group>
    </div>

    <p
      v-else
      class="content-centered background-box location-centered"
    >
      There aren't any awards to display yet
    </p>
  </div>
</template>

<script>
import Error from "../Error.vue";
import AwardsWinner from "./AwardWinner.vue";
import orderBy from "lodash.orderby";

export default {
  name: "MenuAwards",
  components: {
    Error,
    AwardsWinner
  },
  data: function() {
    return {
      awards: []
    };
  },
  props: {
    localtbadb: Object,
    localdb: Object,
    sync_change: Object,
    user: Object
  },
  methods: {
    reloadAwards() {
      var dThis = this;

      this.localtbadb
        .get(this.user.tbaHash.hash + "AWARDS")
        .then(function(doc) {
          dThis.awards = orderBy(
            doc.json,
            [
              function(award) {
                return award.award_type;
              }
            ],
            ["desc"]
          );
        });
    }
  },
  created: function() {
    var dThis = this;
    this.reloadAwards();

    this.sync_change.onBlueAllianceDbChange = function(change) {
      if (change["direction"] == "pull") {
        for (var doc of change["change"]["docs"]) {
          if (doc["_id"] === "AWARDS") {
            dThis.reloadAwards();
          }
        }
      }
    };
  }
};
</script>

<style>
.tba-awards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  text-align: center;
}
</style>