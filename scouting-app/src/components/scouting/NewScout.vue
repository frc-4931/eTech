<template>
<div>
  <div id="scout-new-select" class="background-box grid-perminant">
    <label class="location-left content-padding-left">
      <input class="radio-button" v-model="seleted" value="PitScout" type="radio" name="r_scout_select">
        Pit Scout
    </label>

    <label class="location-right content-right content-padding-right">
      <input class="radio-button" v-model="seleted" value="MatchScout" type="radio" name="r_scout_select">
      Match Scout
    </label>
  </div>

  <div @click="createScout()" class="location-centered-small background-box background-box-hover content-centered">
    <h3>Create</h3>
  </div>

  <div class="line" />
</div>
</template>

<script>
import PitTemplate from "../../assets/pitscout.js";
import MatchTemplate from "../../assets/matchscout.js";

export default {
  name: "NewScout",
  props: {
    teamNumber: Number,
    localdb: Object,
    callback: Function
  },
  data: function() {
    return {
      seleted: "none",
      pitScoutPrefix: "PITSCOUT_",
      matchScoutPrefix: "MATCHSCOUT_",
      pitTemplate: Object,
      matchTemplate: Object
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
      //Add user slat "_USERNAME" to end
      var doc = {
        _id: this.pitScoutPrefix + this.teamNumber + "_" + number // + "_" + USERNAME
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
      //Add user slat "_USERNAME" to end
      var dThis = this;
      var doc = {
        _id: this.matchScoutPrefix + this.teamNumber + "_" + number // + "_" + USERNAME
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
    getPointValue(doc) {
      var points = 0;
      switch (doc["type"]) {
        case "BooleanField":
          points = doc["default"] ? doc["points"][0] : doc["points"][1];
          break;

        case "DropdownField":
          var inxOfOpt = doc["options"].indexOf(doc["default"]);
          points = doc["points"][inxOfOpt];
          break;

        case "NumberFieldInc":
        case "NumberField":
          points = Math.floor(doc["default"] * doc["points"]);
          break;
      }
      return points;
    }
  },
  created() {
    var dThis = this;
    //FINSIH ME. Loads all scouting files and puts ID's into array.
    //TODO: Add match scout loading
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
#scout-new-select {
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
