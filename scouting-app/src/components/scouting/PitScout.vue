<template>
<div>
  <!-- Title Field -->
  <TitleField title="Autonomous"></TitleField>

  <!-- Drop Down Field -->
  <DropdownField title="Dropdowns yay!!!" :options="options" value="Option 2"></DropdownField>

  <!-- Booleon Field -->
  <BooleanField title="Bools yay" :value="true"></BooleanField>

  <!-- Number field -->
  <NumberField title="New num" :value="5" @valuechange="valueChangeNum"></NumberField>

  <!-- Number field inc -->
  <NumberFieldInc title="How many blocks?" :min="0" :max="10" :value="value" @valuechange="valueChange" ></NumberFieldInc>

  <!-- Title Field -->
  <TitleField title="TeleOp"></TitleField>

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
import TitleField from "./TitleField.vue";

export default {
  name: "PitScout",
  components: {
    NumberFieldInc,
    NumberField,
    BooleanField,
    DropdownField,
    TitleField
  },
  props: {
    localdb: Object,
    teamNumber: Number,
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
.pit-scout-input {
  padding: 0px;
}
.pit-scout-div div {
  margin-top: 0px;
}
.pit-scout-div:nth-child(1) div {
  margin-top: 10px;
}
.radio-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid #eceff1;
  transition: 0.2s all ease-in-out;
  outline: none;
  margin-right: 5px;
  position: relative;
  top: 4px;
}
.radio-button:checked {
  border: 6px solid #607d8b;
}
</style>
