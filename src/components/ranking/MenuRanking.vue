<template>
  <p>test</p>
</template>


<script>
export default {
  name: "MenuRanking",
  data: function() {
    return {
      teams: []
    };
  },
  props: {
    bluealliancedb: Object,
    sync_change: Object
  },
  methods: {},
  created: function() {
    this.sync_change.onBlueAllianceDbChange = function(change) {
      if (change["id"] === "RANKINGS") {
        console.log(change.doc.json.rankings);
      }
    };
  }
};
</script>

<style>
</style>
