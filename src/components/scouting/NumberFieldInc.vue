<template>
  <div class="grid-perminant pit-scout-div">
    <p class="location-left background-box">{{ data.title }}</p>

    <div v-if="!locked" @click="increment()" class="noselect background-box content-centered background-box-hover">
      <p>+</p>
    </div>

    <div v-if="!locked" class="background-box content-centered">
      <p>{{ data.value }}</p>
    </div>

    <div v-if="!locked" @click="decrement()" class="noselect background-box content-centered background-box-hover">
      <p>-</p>
    </div>

    <div v-if="locked" class="background-box-input location-right">
      <input v-model.number="data.value" type="number" pattern="[0-9]*" placeholder="Value" disabled>
    </div>
  </div>
</template>

<script>
export default {
  name: "NumberFieldInc",
  props: {
    data: Object,
    locked: Boolean
  },
  data: function() {
    return {
      curValue: 0,
      hasChanged: false,
      useMax: false,
      useMin: false
    };
  },
  methods: {
    increment: function() {
      if (!this.locked) {
        if ((this.useMax && this.data.value < this.data.max) || !this.useMax) {
          this.data.value++;
          this.emitValue();
        }
      }
    },
    decrement: function() {
      if (!this.locked) {
        if ((this.useMin && this.data.value > this.data.min) || !this.useMin) {
          this.data.value--;
          this.emitValue();
        }
      }
    },
    emitValue: function() {
      this.hasChanged = true;
      this.$emit("valuechange", this.data.value, Math.floor(this.getPoints()));
    },
    getPoints() {
      return this.data.points * this.data.value;
    }
  },
  created() {
    this.curValue = this.data.value;
    if (Number.isInteger(this.data.max)) {
      this.useMax = true;
    }
    if (Number.isInteger(this.data.min)) {
      this.useMin = true;
    }
  }
};
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>