<template>
<div>
  <component v-for="scField in pitTemplate" :key="id+(scField.field || scField.title)" :is="scField.type" :data="scField" @valuechange="valueChange(scField.field, $event)"></component>

  <div @click="putScoutData()" class="location-centered-small background-box background-box-hover content-centered">
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
      modifiedFields: {}
    };
  },
  methods: {
    valueChange(field, value) {
      this.$set(this.scoutFields, field, value);

      if (this.modifiedFields[field] == false)
        this.modifiedFields[field] = true;
    },
    getScoutData() {
      var dThis = this;
      this.localdb.get(this.id).then(function(doc) {
        for (var fieldInx in dThis.pitTemplate) {
          var field = dThis.pitTemplate[fieldInx];
          if (field["field"] != undefined) {
            var fieldData;
            var fieldName = field["field"];

            if (doc[fieldName] != undefined) fieldData = doc[fieldName];
            else fieldData = field["default"];

            dThis.$set(dThis.pitTemplate[fieldInx], "value", fieldData);
            dThis.$set(dThis.scoutFields, fieldName, fieldData);
            dThis.modifiedFields[fieldName] = false;
          }
        }
      });
    },
    putScoutData() {
      var dThis = this;
      this.localdb.get(this.id).then(function(doc) {
        for (var i in dThis.modifiedFields) {
          if (dThis.modifiedFields[i] === true) {
            doc[i] = dThis.scoutFields[i];
          }
        }
        dThis.localdb.put(doc);
      });
    }
  },
  created() {
    var dThis = this;
    this.localdb
      .get("TEMPLATE_PITSCOUT")
      .then(function(doc) {
        dThis.pitTemplate = doc.fields;
        dThis.getScoutData();
      })
      .catch(function() {
        //If can't pull template use local pre generated
        dThis.pitTemplate = PitTemplate.fields;
        dThis.getScoutData();
      });
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
