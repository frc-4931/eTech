<template>
  <div class="bracket-slot-container">
    <div
      class="bracket-slot"
      :class="status"
    >
      <p>{{ bracketData[level][location]["alliance"] }}</p>
      <p>{{ bracketData[level][location]["teams"][0] }}</p>
      <p>{{ bracketData[level][location]["teams"][1] }}</p>
      <p>{{ bracketData[level][location]["teams"][2] }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BracketSlot",
  props: {
    location: Number,
    level: String,
    bracketData: Object
  },
  computed: {
    status: function() {
      var assignedClass = "";
      var status = this.bracketData[this.level][this.location]["status"];

      if (status == "winner") {
        assignedClass = "bracket-slot-winner";
      } else if (status == "loser") {
        assignedClass = "bracket-slot-loser";
      }

      return assignedClass;
    }
  }
};
</script>

<style>
.bracket-slot {
  background-color: var(--box-color);
  box-shadow: var(--shadow);

  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;

  display: grid;
  grid-template-columns: 1fr repeat(3, 2fr);
}
.bracket-slot-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bracket-slot-winner {
  background-color: var(--positive);
}
.bracket-slot-loser {
  background-color: var(--negative);
}
</style>
