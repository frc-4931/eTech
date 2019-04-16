<template>
  <div class="grid-perminant scout-div">
    <div class="pitscout-label background-box location-left">
      <p>{{ data.title }}</p>
    </div>

    <div class="background-box-input location-right">
      <input
        v-model.number="data.value"
        @input="changed()"
        type="number"
        pattern="[0-9]*"
        :max="max"
        :min="min"
        placeholder="Value"
        :disabled="locked"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "NumberField",
  props: {
    data: Object,
    locked: Boolean
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
      if (this.data.value > this.max) this.data.value = this.max;
      else if (this.data.value < this.min) this.data.value = this.min;
      this.$emit("valuechange", this.data.value, Math.floor(this.getPoints()));
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