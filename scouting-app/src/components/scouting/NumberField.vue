<template>
<form class="grid-perminant pit-scout-div">
  <div class="background-box location-left">
    <p>{{ title }}</p>
  </div>

  <div class="background-box location-right">
    <input v-model="curValue" @input="changed()" class="pit-scout-input" type="number" pattern="[0-9]*" max="9999" min="-9999" placeholder="Value">
  </div>
</form>
</template>

<script>
export default {
  name: "NumberField",
  props: {
    title: String,
    value: Number
  },
  data: function() {
    return {
      curValue: Number
    };
  },
  methods: {
    changed: function() {
      this.$emit("valuechange", parseInt(this.curValue));
    }
  },
  created() {
    this.curValue = this.value;
  }
};
</script>

<style>
</style>
