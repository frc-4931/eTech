<template>
  <div id="scouting-menu">
    <div class="scouting-menu-fields">
      <component
        v-for="scField in template"
        :key="docId+(scField.field || scField.title)"
        :is="scField.type"
        :data="scField"
        :locked="!hasEdit"
        @valuechange="valueChange(scField.field, ...arguments)"
      ></component>
    </div>

    <div
      v-if="hasEdit"
      class="grid-perminant"
    >
      <SaveButton
        class="location-span pitscout-label"
        :unsavedChanges="unsaved"
        :saveCallback="save"
      />
      <h3
        @click="deleteScout()"
        class="location-left background-box background-box-hover content-centered"
        style="margin-top: 0px; margin-right: 5px;"
      >Delete</h3>
      <h3
        @click="close()"
        class="location-right background-box background-box-hover content-centered"
        style="margin-top: 0px; margin-left: 5px;"
      >Close</h3>
    </div>
    <div
      v-else
      class="grid-perminant"
    >
      <h3
        @click="close()"
        class="location-span background-box background-box-hover content-centered"
      >Close</h3>
    </div>
  </div>
</template>

<script>
import NumberFieldInc from "./NumberFieldInc.vue";
import NumberField from "./NumberField.vue";
import BooleanField from "./BooleanField.vue";
import DropdownField from "./DropdownField.vue";
import TitleField from "./TitleField.vue";
import SaveButton from "../SaveButton.vue";
//Pre genereated template incase there is not one in the db
import PitTemplate from "../../assets/pitscout.js";
import MatchTemplate from "../../assets/matchscout.js";

export default {
  name: "ScoutMenu",
  components: {
    NumberFieldInc,
    NumberField,
    BooleanField,
    DropdownField,
    SaveButton,
    TitleField
  },
  props: {
    localdb: Object,
    docId: String,
    isMatchScout: Boolean,
    callback: Function,
    closeteam: Function,
    shouldUpdate: false,
    hasEdit: Boolean
  },
  watch: {
    shouldUpdate() {
      this.updateScoutData();
    }
  },
  data: function() {
    return {
      template: Array,
      scoutFields: {},
      scoutPoints: {},
      modifiedFields: {},
      unsaved: false
    };
  },
  methods: {
    valueChange(field, value, points) {
      this.$set(this.scoutFields, field, value);

      this.$set(this.scoutPoints, field, points);

      if (this.modifiedFields[field] == false)
        this.modifiedFields[field] = true;

      this.unsaved = true;
    },
    getInitialScoutData() {
      var dThis = this;
      this.localdb.getHASH(this.docId).then(function(doc) {
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
      this.localdb.getHASH(this.docId).then(function(doc) {
        dThis.updateUI(doc);
      });
    },
    updateAndPutData() {
      var dThis = this;
      this.localdb
        .getHASH(this.docId)
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
      this.localdb.getHASH(this.docId).then(function(doc) {
        for (var i in dThis.modifiedFields) {
          if (dThis.modifiedFields[i] === true) {
            doc[i] = dThis.scoutFields[i];
            doc[i + "_POINTS"] = dThis.scoutPoints[i];
          }
        }
        doc["TOTAL-POINTS"] = dThis.getAllFieldPoints();
        dThis.localdb.putHASH(doc);
      });
    },
    putDoc(doc) {
      var dThis = this;
      for (var i in this.modifiedFields) {
        if (this.modifiedFields[i] === true) {
          doc[i] = this.scoutFields[i];
          doc[i + "_POINTS"] = this.scoutPoints[i];
        }
        this.modifiedFields[i] = false;
      }
      this.unsaved = false;

      doc["TOTAL-POINTS"] = this.getAllFieldPoints();
      this.localdb.putHASH(doc).then(function() {
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
    close() {
      if (this.unsaved) {
        if (
          confirm(
            "You have unsaved changes!\nAre you sure you want to close this menu?"
          )
        )
          this.closeteam();
      } else this.closeteam();
    },
    deleteScout() {
      var confirmDelete = confirm(
        "Deleting a scout is very risky!\nThis action cannot be undone!"
      );
      if (confirmDelete) {
        var dThis = this;
        this.localdb.getHASH(this.docId).then(function(doc) {
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
        .getHASH("TEMPLATE_PITSCOUT")
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
        .getHASH("TEMPLATE_MATCHSCOUT")
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
.scout-div div {
  margin: 5px;
}
.scouting-menu-fields {
  padding: 5px;
  padding-top: 0px;
}
.scout-div:first-child {
  margin-top: 0px;
}
.pitscout-label {
  display: flex;
  justify-content: center;
}
</style>