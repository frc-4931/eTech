<template>
<div>
  <component v-for="scField in pitTemplate" :key="scField.field || scField.title" :is="scField.type" :data="objectWithValue(scField)" @valuechange="valueChange(scField.field, $event)"></component>

  <div class="location-centered-small background-box background-box-hover content-centered">
    <h3>Save</h3>
  </div>
  <div class="line"></div>
</div>
</template>

<script>
import NumberFieldInc from "./NumberFieldInc.vue";
import NumberField from "./NumberField.vue";
import BooleanField from "./BooleanField.vue";
import DropdownField from "./DropdownField.vue";
import TitleField from "./TitleField.vue";
//Pre genereated template incase there is not one in the db
import PitTemplate from "../../assets/pitscout.js";

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
    id: String
  },
  data: function() {
    return {
      pitTemplate: Array,
      scoutFields: Object,
      value: 2,
      value2: 0,
      options: ["Option 1", "Option 2"]
    };
  },
  methods: {
    valueChange(field, value) {
      this.$set(this.scoutFields, field, value);
    },
    objectWithValue(obj) {
      if (obj["field"] != undefined) {
        obj.value = this.scoutFields[obj["field"]];
      }
      return obj;
    },
    getScoutData() {
      var dThis = this;
      this.localdb.get(this.id).then(function(doc) {
        for (var field of dThis.pitTemplate) {
          if (field["field"] != undefined) {
            var fieldData;

            if (doc["field"] != undefined) fieldData = doc["field"];
            else fieldData = field["default"];

            dThis.$set(dThis.scoutFields, field["field"], fieldData);
          }
        }
      });
    }
  },
  created() {
    var dThis = this;
    this.localdb
      .get("TEMPLATE_PITSCOUT")
      .then(function(doc) {
        dThis.pitTemplate = doc.fields;
      })
      .catch(function() {
        //If can't pull template use local pre generated
        dThis.pitTemplate = PitTemplate.fields;
      });
    this.getScoutData();
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
