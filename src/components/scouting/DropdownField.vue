<template>
  <div class="grid-perminant scout-div">
    <div class="pitscout-label background-box location-left">
      <p>{{ data.title }}</p>
    </div>

    <div class="background-box-input location-right">
      <select @change="changed()" v-model="data.value" :value="data.value" :disabled="locked">
        <option v-for="option in data.options" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownField",
  props: {
    data: Object,
    locked: Boolean
  },
  data: function() {
    return {
      curValue: String,
      hasChanged: false
    };
  },
  methods: {
    changed: function() {
      this.hasChanged = true;
      this.$emit("valuechange", this.data.value, this.getPoints());
    },
    getPoints() {
      var inxOfOpt = this.data.options.indexOf(this.data.value);
      //alert(inxOfOpt + ": " + this.data.points[inxOfOpt]);
      return this.data.points[inxOfOpt];
    }
  },
  created() {
    this.curValue = this.data.value;
  }
};
</script>