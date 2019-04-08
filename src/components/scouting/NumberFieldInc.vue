<template>
  <div class="grid-perminant pit-scout-div">
    <div class="pitscout-label background-box location-left">
      <p>{{ data.title }}</p>
    </div>

    <div @click="increment()" class="background-box content-centered" :class="locked ? 'background-box-disabled' : 'background-box-hover'">
      <p>+</p>
    </div>

    <div class="background-box content-centered">
      <p>{{ data.value }}</p>
    </div>

    <div @click="decrement()" class="background-box content-centered" :class="locked ? 'background-box-disabled' : 'background-box-hover'">
      <p>-</p>
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