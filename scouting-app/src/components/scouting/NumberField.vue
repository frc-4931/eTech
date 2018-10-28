<template>
<div class="grid-perminant pit-scout-div">
  <div class="background-box location-left">
    <p>{{ data.title }}</p>
  </div>

  <div class="background-box location-right">
    <input v-model="data.value" @input="changed()" class="pit-scout-input" type="number" pattern="[0-9]*" :max="max" :min="min" placeholder="Value">
  </div>
</div>
</template>

<script>
export default {
  name: "NumberField",
  props: {
    data: Object,
    value: Number
  },
  data: function() {
    return {
      curValue: 0,
      hasChanged: false,
      max: 9999,
      min: -9999
    };
  },
  methods: {
    changed: function() {
      this.hasChanged = true;
      this.$emit("valuechange", this.getValue(), Math.floor(this.getPoints()));
    },
    getValue() {
      return parseInt(this.data.value);
    },
    getPoints() {
      return this.data.points * this.data.value;
    }
  },
  created() {
    this.curValue = this.data.value;
    if (Number.isInteger(this.data.max)) {
      this.max = this.data.max;
    }
    if (Number.isInteger(this.data.min)) {
      this.min = this.data.min;
    }
  }
};
</script>

<style>
</style>
