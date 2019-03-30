<template>
  <div
    v-if="loggedin"
    class="grid"
  >
    <BackButton />

    <h1 class="location-span background-box content-centered">Analytics</h1>

    <div class="location-right-large">
      <div
        id="analytics-sorting-options"
        class="background-box content-centered"
      >
        <div>
          <h3>Scouting Type</h3>
          <div class="background-box-input">
            <select v-model="scoutingType">
              <option
                value="select"
                selected
                disabled
              >Select</option>
              <option value="match">Match Scouting</option>
              <option value="pit">Pit Scouting</option>
            </select>
          </div>
        </div>

        <div>
          <h3>Scouting Question</h3>
          <div class="background-box-input">
            <select v-model="scoutingQuestion">
              <option value="d">v-for</option>
            </select>
          </div>
        </div>

        <div>
          <h3>Sorting Method</h3>
          <div class="
          background-box-input">
            <select v-model="sortingMethod">
              <option value="average">Average</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
          </div>
        </div>
      </div>
    </div>

  </div>
  <Error v-else>You must be logged in to view this page!</Error>
</template>

<script>
import Error from "./Error.vue";
import BackButton from "./BackButton.vue";

export default {
  name: "MenuAnalytics",
  components: {
    Error,
    BackButton
  },
  props: {
    localdb: Object,
    remotedb: Object,
    sync_change: Object,
    user: Object,
    reloadSync: Function
  },
  data() {
    return {
      scoutingType: "select",
      scoutingQuestion: "",
      sortingMethod: "average",
      teams: [],
      loggedin: true
    };
  },
  methods: {},
  watch: {
    user: {
      handler: function(newValue) {
        if (
          newValue.role === "_admin" ||
          newValue.role === "edit" ||
          newValue.role === "view"
        ) {
          this.loggedin = true;
        } else {
          this.loggedin = false;
        }
      },
      deep: true
    }
  }
};
</script>

<style>
#analytics-sorting-options * {
  --box-color: var(--background-color);
}

@media (min-width: 1200px) {
  #analytics-sorting-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

