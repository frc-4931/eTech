<template>
  <div
    v-if="loggedin"
    class="grid"
  >
    <h1 class="location-span background-box content-centered">Analytics</h1>

  </div>
  <Error v-else>You must be logged in to view this page!</Error>
</template>

<script>
import Error from "./Error.vue";

export default {
  name: "MenuAnalytics",
  components: {
    Error
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
      loggedin: false
    };
  },
  created() {
    if (
      this.user.role === "_admin" ||
      this.user.role === "edit" ||
      this.user.role === "view"
    ) {
      this.loggedin = true;
    }
  },
  watch: {
    user: {
      handler: function(newValue) {
        if (
          newValue.role === "_admin" ||
          newValue.role === "edit" ||
          newValue.role === "view"
        ) {
          if (this.loggedin === false) {
            this.loggedin = true;
            this.initRoutine();
          }
        }
      },
      deep: true
    }
  }
};
</script>
