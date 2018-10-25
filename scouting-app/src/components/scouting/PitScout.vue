<template>
<div>
  <!-- Drop Down Field -->
  <DropdownField title="Dropdowns yay!!!" :options="options" value="Option 2"></DropdownField>

  <!-- Booleon Field -->
  <BooleanField title="Bools yay" :value="true"></BooleanField>

  <!-- Number field -->
  <NumberField title="New num" :value="5" @valuechange="valueChangeNum"></NumberField>

  <!-- Number field inc -->
  <NumberFieldInc title="How many blocks?" :min="0" :max="10" :value="value" @valuechange="valueChange" ></NumberFieldInc>

</div>
</template>

<script>
import NumberFieldInc from "./NumberFieldInc.vue";
import NumberField from "./NumberField.vue";
import BooleanField from "./BooleanField.vue";
import DropdownField from "./DropdownField.vue";

export default {
  name: "PitScout",
  components: {
    NumberFieldInc,
    NumberField,
    BooleanField,
    DropdownField
  },
  props: {
    localdb: Object,
    teamNumber: Number,
    teamName: String,
    id: String
  },
  data: function() {
    return {
      value: 2,
      value2: 0,
      options: ["Option 1", "Option 2"]
    };
  },
  methods: {
    valueChange: function(event) {
      this.value = event;
    },
    valueChangeNum: function(event) {
      this.value2 = event;
    }
  }
};
</script>

<style>
</style>
