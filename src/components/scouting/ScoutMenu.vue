<template>
  <div id="scouting-menu">
    <component
      v-for="scField in template"
      :key="docId+(scField.field || scField.title)"
      :is="scField.type"
      :data="scField"
      :locked="!hasEdit"
      @valuechange="valueChange(scField.field, ...arguments)"
    ></component>
    <h3
      v-if="hasEdit"
      @click="save()"
      class="location-centered-small background-box background-box-hover content-centered"
    >Save</h3>
    <h3
      v-if="hasEdit"
      @click="deleteScout()"
      class="location-centered-small background-box background-box-hover content-centered"
    >Delete</h3>
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
    docId: String,
    isMatchScout: Boolean,
    callback: Function,
    closeteam: Function,
    shouldUpdate: false,
    callUpdated: Function,
    hasEdit: Boolean
  },
  watch: {
    shouldUpdate(newValue, oldValue) {
      if (newValue === true) {
        this.updateScoutData();
        this.callUpdated();
      }
    }
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
      this.localdb.get(this.docId).then(function(doc) {
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
      this.localdb.get(this.docId).then(function(doc) {
        dThis.updateUI(doc);
      });
    },
    updateAndPutData() {
      var dThis = this;
      this.localdb
        .get(this.docId)
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
      this.localdb.get(this.docId).then(function(doc) {
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
      this.modifiedFields = [];
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
    },
    deleteScout() {
      var confirmDelete = confirm(
        "Deleting a scout is very risky!\nThis action cannot be undone!"
      );
      if (confirmDelete) {
        var dThis = this;
        this.localdb.get(this.docId).then(function(doc) {
          dThis.localdb.remove(doc).then(function() {
            dThis.closeteam();
          });
        });
      }
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
.pit-scout-div div,
.pit-scout-div div .location-left,
.pit-scout-div div .location-right {
  margin-bottom: 0px !important;
}
.pit-scout-div:nth-child(1) div {
  margin-top: 10px !important;
}
</style>