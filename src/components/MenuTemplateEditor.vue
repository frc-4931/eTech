<template>
  <div v-if="isAdmin">
    <div class="grid">
      <div class="location-centered-small background-box content-centered">
        <h2>Template Editor</h2>
      </div>

      <div class="location-centered-small content-centered">
        <h3 class="background-box">Select Template to Edit:</h3>

        <div class="background-box-input">
          <select
            v-model="curTemplate"
            @change="loadTemplate(curTemplate)"
            id="select-template"
            class="content-input-large"
          >
            <option
              value="none"
              disabled
            >Select a Scouting Template</option>
            <option value="TEMPLATE_PITSCOUT">Pit Scout</option>
            <option value="TEMPLATE_MATCHSCOUT">Match Scout</option>
          </select>
        </div>
      </div>

      <div class="location-centered-small">
        <!-- beautify ignore:start -->
        <component
          v-for="(field, index) in fields"
          :key="field.field || field.title"
          :id="field.field || field.title.replace(/[^a-zA-Z]/g, '')"
          :is="fieldIs(field)"
          :indata="field"
          :data="field"
          @clicked="openField(field)"
          @save="saveField(index, ...arguments)"
          @close="closeField()"
          @delete="deleteField(index)"
          @move-up="moveUp(index)"
          @move-down="moveDown(index)"
        ></component>
        <!-- beautify ignore:end -->

        <div
          v-if="curOpen == 'field_add'"
          id="template-field-add"
        >
          <div class="line" />

          <h3 class="background-box content-centered">Creating New Field</h3>

          <div class="field-edit">
            <p class="background-box">Display Name</p>
            <div class="background-box-input">
              <input
                type="text"
                v-model.trim="newFieldTitle"
                placeholder="Display Name"
              />
            </div>
          </div>
          <div class="field-edit small-margin">
            <p class="background-box">Type</p>
            <div class="background-box-input">
              <select v-model="newFieldType">
                <option value="TitleField">Title</option>
                <option value="BooleanField">Boolean</option>
                <option value="DropdownField">Dropdown</option>
                <option value="NumberField">Number</option>
                <option value="NumberFieldInc">Number Incremential</option>
              </select>
            </div>
          </div>

          <div
            @click="createField()"
            class="background-box background-box-hover content-centered"
          >
            <p>Create</p>
          </div>
          <div
            @click="closeField()"
            class="background-box background-box-hover content-centered"
          >
            <p>Cancel</p>
          </div>
        </div>

        <div
          v-else-if="curTemplate != 'none' && curOpen == 'none'"
          class="location-centered-small content-centered"
        >
          <div class="line" />

          <div
            @click="openFieldAdd()"
            class=" background-box background-box-hover"
          >
            <h3>Create New field</h3>
          </div>

          <h3
            @click="saveTemplate(curTemplate)"
            class="location-centered-small background-box"
            :class="
              this.unsaved ? 'background-box-hover' : 'background-box-disabled'
            "
          >
            Save
          </h3>
        </div>
      </div>
    </div>
  </div>
  <Error v-else>You must be logged in as an admin to view this page!</Error>
</template>

<script>
import TemplateField from "./admin/template/TemplateField.vue";

import TemplateEditTitle from "./admin/template/TemplateEditTitle.vue";
import TemplateEditBoolean from "./admin/template/TemplateEditBoolean.vue";
import TemplateEditDropdown from "./admin/template/TemplateEditDropdown.vue";
import TemplateEditNumber from "./admin/template/TemplateEditNumber.vue";
import TemplateEditNumberInc from "./admin/template/TemplateEditNumberInc.vue";

import PitTemplate from "../assets/pitscout.js";
import MatchTemplate from "../assets/matchscout.js";

import Error from "@/components/Error.vue";

import { scroller } from "vue-scrollto/src/scrollTo";

export default {
  name: "MenuTemplateEditor",
  props: {
    popup: Object,
    localdb: Object,
    remotedb: Object
  },
  components: {
    TemplateEditTitle,
    TemplateField,
    TemplateEditBoolean,
    TemplateEditDropdown,
    TemplateEditNumber,
    TemplateEditNumberInc,
    Error
  },
  data: function() {
    return {
      fields: [],
      curOpen: "none",
      newFieldTitle: "",
      newFieldType: "TitleField",
      curTemplate: "none",
      scrollTo: scroller(),
      isAdmin: true,
      unsaved: false
    };
  },
  methods: {
    fieldIs(field) {
      var fieldID = field.field || field.title;
      if (this.curOpen == fieldID) {
        return "TemplateEdit" + field.type.replace("Field", "");
      } else {
        return "TemplateField";
      }
    },
    fieldExists(fieldID) {
      for (var i of this.fields) {
        if (i.field == fieldID) {
          return true;
        }
      }
      return false;
    },
    createField() {
      if (this.newFieldTitle == "") return;
      var field = {
        title: this.newFieldTitle,
        type: this.newFieldType
      };

      var date = new Date();
      var d = date.getSeconds() + "_" + date.getMilliseconds();

      if (this.newFieldType == "TitleField") {
        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "BooleanField") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_boolean";
        field.default = false;
        field.points = [0, 0];

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_boolean";
        }

        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "DropdownField") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_dropdown";
        field.options = [];
        field.points = [];
        field.default = "";

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") +
            "_" +
            d +
            "_dropdown";
        }

        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "NumberField") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_number";
        field.default = 0;
        field.points = 0;
        field.min = 0;

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_number";
        }

        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "NumberFieldInc") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_numnerinc";
        field.points = 0;
        field.default = 0;
        field.min = 0;

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") +
            "_" +
            d +
            "_numnerinc";
        }

        this.fields.push(field);
        this.closeField();
      }
      this.unsaved = true;
    },
    openFieldAdd() {
      var dThis = this;
      this.newFieldTitle = "";
      this.newFieldType = "TitleField";
      this.curOpen = "field_add";

      this.$nextTick().then(function() {
        dThis.scrollTo("#template-field-add", 500, { offset: -10 });
      });
    },
    openField(field) {
      var dThis = this;
      this.curOpen = field.field || field.title;
      var scrollEl = field.field || field.title.replace(/[^a-zA-Z]/g, "");
      this.$nextTick().then(function() {
        dThis.scrollTo("#" + scrollEl, 500, { offset: -10 });
      });
    },
    saveField(index, fieldData) {
      this.$set(this.fields, index, Object.assign({}, fieldData));
      this.unsaved = true;
    },
    closeField() {
      this.curOpen = "none";
    },
    deleteField(index) {
      this.popup
        .newPopup(
          "Delete field?",
          "You are about to delete '" + this.fields[index].title + "'",
          ["Cancel", "Delete"]
        )
        .then(option => {
          if (option == "Delete") {
            this.fields.splice(index, 1);
            this.unsaved = true;
          }
        });
    },
    moveUp(index) {
      if (index > 0) this.arrayMove(this.fields, index, index - 1);
      this.unsaved = true;
    },
    moveDown(index) {
      if (index < this.fields.length - 1)
        this.arrayMove(this.fields, index, index + 1);
      this.unsaved = true;
    },
    loadTemplate(template) {
      var dThis = this;
      this.fields = [];
      if (template == "none") return;
      this.localdb
        .getHASH(template)
        .then(function(doc) {
          dThis.fields = doc.fields;
        })
        .catch(function(err) {
          if (err.status == 404) {
            dThis.popup.newPopup(
              "Failed to load template",
              "Creating a blank template instead. If there is an existing template saving will overwrite it!",
              undefined
            );
          }
        });
    },
    saveTemplate(template) {
      var dThis = this;

      if (this.curTemplate === "none") return;

      if (!this.unsaved) return;

      if (this.fields.length < 1) {
        dThis.popup.newPopup(
          undefined,
          "You must have at least one field!",
          undefined
        );
        return;
      }

      for (var i of this.fields) {
        if (
          i.type === "DropdownField" &&
          (i.options.length < 1 || i.points.length < 1)
        ) {
          this.popup.newPopup(
            undefined,
            "Dropdown field '" + i.title + "' has no options.",
            undefined
          );

          return;
        }
      }

      this.localdb
        .getHASH(template)
        .then(function(doc) {
          doc.fields = dThis.fields;
          dThis.localdb
            .putHASH(doc)
            .then(function() {
              dThis.popup.newPopup(
                "Saved",
                "Successfully saved to the database!",
                undefined
              );
              dThis.unsaved = false;
              dThis.updateAllTeamPoints();
            })
            .catch(err => {
              dThis.popup.catchError(err);
            });
        })
        .catch(function(err) {
          if (err.status == 404) {
            dThis.popup.newPopup("");

            dThis.popup
              .newPopup(
                "Failed to load template",
                "Failed to retrive an existing template.\nPush anyway?\n\nWarning: Pushing will overwrite any existing template!",
                ["Cancel", "Save"]
              )
              .then(option => {
                if (option == "Save") {
                  var doc = { _id: template, fields: dThis.fields };
                  dThis.localdb.putHASH(doc).then(function() {
                    dThis.popup.newPopup(
                      "Saved",
                      "Successfully saved to the database!",
                      undefined
                    );
                    dThis.unsaved = false;
                    dThis.updateAllTeamPoints();
                  });
                }
              });
          }
        });
    },
    arrayMove(arr, oldIndex, newIndex) {
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },
    updateAllTeamPoints() {
      //Loop through all teams and update their point values
      var dThis = this;
      this.localdb
        .allDocsHASH({
          include_docs: false,
          startkey: "TEAM_0",
          endkey: "TEAM_\ufff0"
        })
        .then(function(result) {
          // Loop through all team docs
          for (var doc of result["rows"]) {
            // Get current team doc
            var team = doc["id"].replace("TEAM_", "");

            dThis.loadScouting(team);
          }
        });
    },
    loadScouting: function(team) {
      var dThis = this;
      var dPoints = { pPoints: 0, pAmount: 0, mPoints: 0, mAmount: 0 };

      this.localdb
        .allDocsHASH({
          include_docs: true,
          startkey: "PITSCOUT_" + team + "_0",
          endkey: "PITSCOUT_" + team + "_\ufff0"
        })
        .then(function(docs) {
          return dThis.localdb
            .getHASH("TEMPLATE_PITSCOUT")
            .then(function(doc) {
              return doc["fields"];
            })
            .catch(function() {
              return PitTemplate.fields;
            })
            .then(function(fields) {
              var points = 0;
              var itr = 0;
              var dDocs = docs["rows"];
              var outDocs = [];
              for (var doc of dDocs) {
                doc = doc["doc"];
                points += dThis.setScoutingPoints(doc, fields);
                outDocs.push(doc);
                itr++;
              }
              dPoints.pPoints += points;
              dPoints.pAmount += itr;

              dThis.localdb.bulkDocs(outDocs);
            });
        })
        .then(function() {
          return dThis.localdb.allDocsHASH({
            include_docs: true,
            startkey: "MATCHSCOUT_" + team + "_",
            endkey: "MATCHSCOUT_" + team + "_\ufff0"
          });
        })
        .then(function(docs) {
          return dThis.localdb
            .getHASH("TEMPLATE_MATCHSCOUT")
            .then(function(doc) {
              return doc["fields"];
            })
            .catch(function() {
              return MatchTemplate.fields;
            })
            .then(function(fields) {
              var points = 0;
              var itr = 0;
              var dDocs = docs["rows"];
              var outDocs = [];
              for (var doc of dDocs) {
                doc = doc["doc"];
                points += dThis.setScoutingPoints(doc, fields);
                outDocs.push(doc);
                itr++;
              }
              dPoints.mPoints += points;
              dPoints.mAmount += itr;

              dThis.localdb.bulkDocs(outDocs);
            });
        })
        .then(function() {
          dThis.localdb.getHASH("TEAM_" + team).then(function(doc) {
            var matchPoints =
              dPoints.mPoints / (dPoints.mAmount > 0 ? dPoints.mAmount : 1);

            var pitPoints =
              dPoints.pPoints / (dPoints.pAmount > 0 ? dPoints.pAmount : 1);

            var points = matchPoints + pitPoints;

            points = Math.floor(points);

            if (doc.objectivePoints != points) {
              doc.objectivePoints = points;
              dThis.localdb.putHASH(doc);
            }
          });
        });
    },
    setScoutingPoints(doc, fields) {
      let totalPoints = 0;
      for (let field of fields) {
        if (field["field"] != undefined) {
          var fieldData;
          var fieldType = field["type"];
          var fieldName = field["field"];
          var fieldPoints = field["points"];
          var points;

          if (doc[fieldName] != undefined) fieldData = doc[fieldName];
          else fieldData = field["default"];

          if (fieldType == "DropdownField") {
            var options = field["options"];
            var inx = options.indexOf(fieldData);
            points = parseInt(fieldPoints[inx]);

            totalPoints += points;
            doc[fieldName + "_POINTS"] = points;
          } else if (fieldType == "BooleanField") {
            points =
              fieldData == true
                ? parseInt(fieldPoints[0])
                : parseInt(fieldPoints[1]);

            totalPoints += points;
            doc[fieldName + "_POINTS"] = points;
          } else if (fieldType == "NumberField") {
            points = parseInt(fieldData) * parseInt(fieldPoints);

            totalPoints += points;
            doc[fieldName + "_POINTS"] = points;
          } else if (fieldType == "NumberFieldInc") {
            points = parseInt(fieldData) * parseInt(fieldPoints);

            totalPoints += parseInt(points);
            doc[fieldName + "_POINTS"] = parseInt(points);
          }
        }
      }
      doc["TOTAL-POINTS"] = totalPoints;
      return totalPoints;
    }
  },
  created() {
    var dThis = this;
    this.remotedb.getSession(function(err, response) {
      if (err) {
        //There was an error
      } else if (response.userCtx.roles.indexOf("_admin") != -1) {
        dThis.isAdmin = true;
      } else {
        dThis.isAdmin = false;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.unsaved)
      this.popup
        .newPopup(
          "Unsaved Changes",
          "Are you sure you would like to leave this page, you have unsaved changes!",
          ["Leave", "Stay"]
        )
        .then(option => {
          if (option == "Leave") next();
          if (option == "Stay") next(false);
        });
    else next();
  }
};
</script>

<style>
.field-edit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>