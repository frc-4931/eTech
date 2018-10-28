<template>
<form onsubmit="return false;" class="grid-perminant pit-scout-div">
  <div class="background-box location-left">
    <p>{{ data.title }}</p>
  </div>

  <div class="location-right background-box grid-perminant">
    <label class="location-left">
      <input class="radio-button" @change="changed()" :value="true" type="radio" name="radio1" v-model="data.value">
        True
    </label>

    <label class="location-right">
      <input class="radio-button" @change="changed()" :value="false" type="radio" name="radio1" v-model="data.value">
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
      curValue: false,
      hasChanged: false
    };
  },
  methods: {
    changed: function() {
      this.hasChanged = true;
      this.$emit("valuechange", this.data.value, this.getPoints());
    },
    setTrue: function() {
      this.data.value = true;
      this.changed();
    },
    setFalse: function() {
      this.data.value = false;
      this.changed();
    },
    getPoints() {
      if (this.data.points) {
        var tPoints = this.data.points[0];
        var fPoints = this.data.points[1];
        return this.data.value ? tPoints : fPoints;
      } else {
        return 0;
      }
    }
  },
  created() {
    this.curValue = this.data.value;
  }
};
</script>

<style>
</style>
