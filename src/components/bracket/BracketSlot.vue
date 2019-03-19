<template>
  <div class="bracket-slot-container">
    <div
      class="bracket-slot"
      :class="status"
    >

      <p>{{ bracketData[level][location]["alliance"] }}</p>
      <router-link :to="{name: 'team', params: { number: this.bracketData[level][location]['teams'][0] }}">{{ bracketData[level][location]["teams"][0] }}</router-link>
      <router-link :to="{name: 'team', params: { number: this.bracketData[level][location]['teams'][1] }}">{{ bracketData[level][location]["teams"][1] }}</router-link>
      <router-link :to="{name: 'team', params: { number: this.bracketData[level][location]['teams'][2] }}">{{ bracketData[level][location]["teams"][2] }}</router-link>
      <div class="display-status" />
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
  grid-template-columns: 1fr repeat(3, 3fr) 1fr;
}
.bracket-slot p:first-child {
  font-weight: bold;
}
.bracket-slot-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bracket-slot-winner .display-status {
  background-color: var(--positive);
}
.bracket-slot-loser .display-status {
  background-color: var(--negative);
}
</style>
