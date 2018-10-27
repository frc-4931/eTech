<template>
<div>
  <component v-for="scField in template" :key="id+(scField.field || scField.title)" :is="scField.type" :data="scField" @valuechange="valueChange(scField.field, ...arguments)"></component>

  <div @click="save()" class="location-centered-small background-box background-box-hover content-centered">
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
import MatchTemplate from "../../assets/matchscout.js";

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
    id: String,
    isMatchScout: Boolean,
    callback: Function
  },
  data: function() {
    return {
      template: Array,
      scoutFields: {},
      scoutPoints: {},
      modifiedFields: {}
    };
  },
  methods: {
    valueChange(field, value, points) {
      this.$set(this.scoutFields, field, value);

      this.$set(this.scoutPoints, field, points);

      if (this.modifiedFields[field] == false)
        this.modifiedFields[field] = true;
    },
    getInitialScoutData() {
      var dThis = this;
      this.localdb.get(this.id).then(function(doc) {
        for (var fieldInx in dThis.template) {
          var field = dThis.template[fieldInx];
          if (field["field"] != undefined) {
            var fieldData;
            var fieldName = field["field"];

            if (doc[fieldName] != undefined) fieldData = doc[fieldName];
            else fieldData = field["default"];

            dThis.$set(dThis.template[fieldInx], "value", fieldData);
            dThis.$set(dThis.scoutFields, fieldName, fieldData);
            dThis.$set(
              dThis.scoutPoints,
              fieldName,
              doc[fieldName + "_POINTS"]
            );
            dThis.modifiedFields[fieldName] = false;
          }
        }
      });
    },
    updateScoutData() {
      var dThis = this;
      this.localdb.get(this.id).then(function(doc) {
        dThis.updateUI(doc);
      });
    },
    updateAndPutData() {
      var dThis = this;
      this.localdb
        .get(this.id)
        .then(function(doc) {
          dThis.updateUI(doc);
          return doc;
        })
        .then(function(doc) {
          dThis.putDoc(doc);
        });
    },
    updateUI(doc) {
      for (var fieldInx in this.template) {
        var field = this.template[fieldInx];

        var fieldName = field["field"];
        if (
          fieldName != undefined &&
          this.modifiedFields[fieldName] === false
        ) {
          var fieldData;

          if (doc[fieldName] != undefined) fieldData = doc[fieldName];
          else fieldData = field["default"];

          this.$set(this.template[fieldInx], "value", fieldData);
          this.$set(this.scoutFields, fieldName, fieldData);
          this.$set(this.scoutPoints, fieldName, doc[fieldName + "_POINTS"]);
        }
      }
    },
    putScoutData() {
      var dThis = this;
      this.localdb.get(this.id).then(function(doc) {
        for (var i in dThis.modifiedFields) {
          if (dThis.modifiedFields[i] === true) {
            doc[i] = dThis.scoutFields[i];
            doc[i + "_POINTS"] = dThis.scoutPoints[i];
          }
        }
        doc["TOTAL-POINTS"] = dThis.getAllFieldPoints();
        dThis.localdb.put(doc);
      });
    },
    putDoc(doc) {
      var dThis = this;
      for (var i in this.modifiedFields) {
        if (this.modifiedFields[i] === true) {
          doc[i] = this.scoutFields[i];
          doc[i + "_POINTS"] = this.scoutPoints[i];
        }
      }
      doc["TOTAL-POINTS"] = this.getAllFieldPoints();
      this.localdb.put(doc).then(function() {
        dThis.callback();
      });
    },
    setFieldPoints(field, points) {
      this.$set(this.scoutPoints, field, points);
    },
    getAllFieldPoints() {
      var totalPoints = 0;
      for (var field in this.scoutPoints) {
        totalPoints += this.scoutPoints[field];
      }
      return totalPoints;
    },
    save() {
      this.updateAndPutData();
    }
  },
  created() {
    var dThis = this;
    if (this.isMatchScout === false) {
      this.localdb
        .get("TEMPLATE_PITSCOUT")
        .then(function(doc) {
          dThis.template = doc.fields;
        })
        .catch(function() {
          //If can't pull template use local pre generated
          dThis.template = PitTemplate.fields;
        })
        .then(function() {
          dThis.getInitialScoutData();
        });
    } else {
      this.localdb
        .get("TEMPLATE_MATCHSCOUT")
        .then(function(doc) {
          dThis.template = doc.fields;
        })
        .catch(function() {
          //If can't pull template use local pre generated
          dThis.template = MatchTemplate.fields;
        })
        .then(function() {
          dThis.getInitialScoutData();
        });
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
