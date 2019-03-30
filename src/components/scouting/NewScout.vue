<template>
  <div v-if="loggedin">
    <div class="background-box grid-perminant">
      <label class="location-left content-padding-left">
        <input class="radio-button" v-model="seleted" value="PitScout" type="radio" name="r_scout_select">
        Pit Scout
      </label>

      <label class="location-right content-right content-padding-right">
        <input class="radio-button" v-model="seleted" value="MatchScout" type="radio" name="r_scout_select">
        Match Scout
      </label>
    </div>

    <h3 @click="createScout()" class="location-centered-small background-box background-box-hover content-centered">Create</h3>
  </div>
  <Error v-else>You must be logged in to create a new scout!</Error>
</template>

<script>
import PitTemplate from "../../assets/pitscout.js";
import MatchTemplate from "../../assets/matchscout.js";
import Error from "../Error.vue";

export default {
  name: "NewScout",
  components: { Error },
  props: {
    teamNumber: Number,
    localdb: Object,
    user: Object,
    callback: Function
  },
  data: function() {
    return {
      seleted: "none",
      pitScoutPrefix: "PITSCOUT_",
      matchScoutPrefix: "MATCHSCOUT_",
      pitTemplate: Object,
      matchTemplate: Object,
      loggedin: false
    };
  },
  methods: {
    createScout() {
      var dThis = this;

      if (this.seleted == "PitScout") {
        this.localdb
          .allDocs({
            include_docs: false,
            startkey: dThis.pitScoutPrefix + dThis.teamNumber + "_0",
            endkey: dThis.pitScoutPrefix + dThis.teamNumber + "_\ufff0"
          })
          .then(function(docs) {
            var len = docs["rows"].length;
            var pitScoutNumber = 0;
            if (len > 0) {
              var pitScoutString = docs["rows"][len - 1].id.replace(
                dThis.pitScoutPrefix + dThis.teamNumber + "_",
                ""
              );
              if (pitScoutString.includes("_")) {
                var inx = pitScoutString.indexOf("_");
                pitScoutString = pitScoutString.slice(0, inx);
              }
              pitScoutNumber = parseInt(pitScoutString) + 1;
            }
            dThis.createPitScout(pitScoutNumber);
          });
      } else if (this.seleted == "MatchScout") {
        this.localdb
          .allDocs({
            include_docs: false,
            startkey: dThis.matchScoutPrefix + dThis.teamNumber + "_0",
            endkey: dThis.matchScoutPrefix + dThis.teamNumber + "_\ufff0"
          })
          .then(function(docs) {
            var len = docs["rows"].length;
            var matchScoutNumber = 0;
            if (len > 0) {
              var matchScoutString = docs["rows"][len - 1].id.replace(
                dThis.matchScoutPrefix + dThis.teamNumber + "_",
                ""
              );
              if (matchScoutString.includes("_")) {
                var inx = matchScoutString.indexOf("_");
                matchScoutString = matchScoutString.slice(0, inx);
              }
              matchScoutNumber = parseInt(matchScoutString) + 1;
            }
            dThis.createMatchScout(matchScoutNumber);
          });
      } else {
        alert("You must choose a scouting type!");
      }
    },
    createPitScout(number) {
      var dThis = this;
      var doc = {
        _id:
          this.pitScoutPrefix +
          this.teamNumber +
          "_" +
          number +
          "_" +
          this.user.username
      };

      var totalPoints = 0;
      for (var item of this.pitTemplate) {
        if (item["type"] != "TitleField") {
          var points = this.getPointValue(item);
          totalPoints += points;

          doc[item["field"]] = item["default"];
          doc[item["field"] + "_POINTS"] = points;
        }
      }
      doc["TOTAL-POINTS"] = totalPoints;
      this.localdb.put(doc).then(function() {
        dThis.callback(doc._id);
      });
    },
    createMatchScout(number) {
      var dThis = this;
      var doc = {
        _id:
          this.matchScoutPrefix +
          this.teamNumber +
          "_" +
          number +
          "_" +
          this.user.username
      };

      var totalPoints = 0;
      for (var item of this.matchTemplate) {
        if (item["type"] != "TitleField") {
          var points = this.getPointValue(item);
          totalPoints += points;

          doc[item["field"]] = item["default"];
          doc[item["field"] + "_POINTS"] = points;
        }
      }
      doc["TOTAL-POINTS"] = totalPoints;
      this.localdb.put(doc).then(function() {
        dThis.callback(doc._id);
      });
    },
    getPointValue(field) {
      //Calculates the default point values for a field. Field must follow template pattern.
      var points = 0;
      switch (field["type"]) {
        case "BooleanField":
          points = field["default"] ? field["points"][0] : field["points"][1];
          break;

        case "DropdownField":
          var inxOfOpt = field["options"].indexOf(field["default"]);
          points = field["points"][inxOfOpt];
          break;

        case "NumberFieldInc":
        case "NumberField":
          points = Math.floor(field["default"] * field["points"]);
          break;
      }
      return points;
    }
  },
  created() {
    if (this.user.username != null) {
      this.loggedin = true;
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

      this.localdb
        .get("TEMPLATE_MATCHSCOUT")
        .then(function(doc) {
          dThis.matchTemplate = doc.fields;
        })
        .catch(function() {
          //If can't pull template use local pre generated
          dThis.matchTemplate = MatchTemplate.fields;
        });
    } else {
      this.loggedin = false;
    }
  }
};
</script>

<style>
.content-padding-right {
  padding-right: 30%;
}
.content-padding-left {
  padding-left: 30%;
}
</style>