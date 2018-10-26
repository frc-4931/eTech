<template>
  <div class="grid-perminant pit-scout-div">
    <div class="background-box location-left">
      <p>{{ data.title }}</p>
    </div>

    <div class="background-box location-right">
      <select @change="changed()" v-model="curValue" :value="data.value" class="pit-scout-input" required>
          <option v-for="option in data.options" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownField",
  props: {
    data: Object
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
    this.curValue = this.data.value;
  }
};
</script>

<style>
</style>
