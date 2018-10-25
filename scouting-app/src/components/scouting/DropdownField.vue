<template>
  <div class="grid-perminant pit-scout-div">
    <div class="background-box location-left">
      <p>{{ title }}</p>
    </div>

    <div class="background-box location-right">
      <select @change="changed()" v-model="curValue" :value="value" class="pit-scout-input" required>
          <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownField",
  props: {
    title: String,
    value: String,
    options: Array
  },
  data: function() {
    return {
      curValue: String
    };
  },
  methods: {
    changed: function() {
      this.$emit("valuechange", this.curValue);
    }
  },
  created() {
    this.curValue = this.value;
  }
};
</script>

<style>
</style>
