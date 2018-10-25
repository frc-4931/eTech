<template>
<form class="grid-perminant pit-scout-div">
  <div class="location-left background-box">
    <p>{{ title }}</p>
  </div>

  <div @click="increment()" class="noselect background-box content-centered background-box-hover">
    <p>+</p>
  </div>

  <div class="background-box content-centered">
    <p>{{ curValue }}</p>
  </div>

  <div @click="decrement()" class="noselect background-box content-centered background-box-hover">
    <p>-</p>
  </div>
</form>  
</template>

<script>
export default {
  name: "NumberFieldInc",
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    min: Number,
    max: Number
  },
  data: function() {
    return {
      curValue: 0,
      useMax: false,
      useMin: false
    };
  },
  methods: {
    increment: function() {
      if ((this.useMax && this.curValue < this.max) || !this.useMax) {
        this.curValue++;
        this.emitValue();
      }
    },
    decrement: function() {
      if ((this.useMin && this.curValue > this.min) || !this.useMin) {
        this.curValue--;
        this.emitValue();
      }
    },
    emitValue: function() {
      this.$emit("valuechange", this.curValue);
    }
  },
  created() {
    this.curValue = this.value;
    if (Number.isInteger(this.max)) {
      this.useMax = true;
    }
    if (Number.isInteger(this.min)) {
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
