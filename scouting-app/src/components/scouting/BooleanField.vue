<template>
<form onsubmit="return false;" class="grid-perminant pit-scout-div">
  <div class="background-box location-left">
    <p>{{ data.title }}</p>
  </div>

  <div class="location-right background-box grid-perminant">
    <label class="location-left">
      <input class="radio-button" @change="setTrue()" type="radio" name="radio1" v-bind:checked="curValue">
        True
    </label>

    <label class="location-right">
      <input class="radio-button" @change="setFalse()" type="radio" name="radio1" v-bind:checked="!curValue">
      False
    </label>
  </div>
</form>
</template>

<script>
export default {
  name: "BooleanField",
  props: {
    data: Object
  },
  data: function() {
    return {
      curValue: Boolean
    };
  },
  methods: {
    changed: function() {
      this.$emit("valuechange", this.curValue);
    },
    setTrue: function() {
      this.curValue = true;
      this.changed();
    },
    setFalse: function() {
      this.curValue = false;
      this.changed();
    }
  },
  created() {
    this.curValue = this.data.value;
  }
};
</script>

<style>
</style>
