<template>
<div class="grid-perminant pit-scout-div">
  <div class="background-box location-left">
    <p>{{ data.title }}</p>
  </div>

  <div class="background-box location-right">
    <input v-model="data.value" @input="changed()" class="pit-scout-input" type="number" pattern="[0-9]*" max="9999" min="-9999" placeholder="Value">
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
      hasChanged: false
    };
  },
  methods: {
    changed: function() {
      this.hasChanged = true;
      this.$emit("valuechange", parseInt(this.data.value));
    }
  },
  created() {
    this.curValue = this.data.value;
  }
};
</script>

<style>
</style>
