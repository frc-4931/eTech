<template>
  <div v-if="loggedin">
    <div class="background-box grid-perminant">
      <label class="location-left content-padding-left">
        <input
          class="radio-button"
          v-model="seleted"
          value="PitScout"
          type="radio"
          name="r_scout_select"
        >
        Pit Scout
      </label>

      <label class="location-right content-right content-padding-right">
        <input
          class="radio-button"
          v-model="seleted"
          value="MatchScout"
          type="radio"
          name="r_scout_select"
        >
        Match Scout
      </label>
    </div>

    <div
      v-if="seleted == 'MatchScout'"
      class="background-box-input"
      id="match-select"
    >
      <select
        v-model="matchID"
        class="content-input-large"
      >
        <option value="none">Select A Match</option>
        <optgroup
          v-if="qualMatches.length > 0"
          label="Qualification Matches"
        >
          <option
            v-for="match in qualMatches"
            :key="match"
            :value="'TBA-'+match"
          >{{ getMatchTitle(match) }}</option>
        </optgroup>
        <optgroup
          v-if="qfMatches.length > 0"
          label="Quarter-Final Matches"
        >
          <option
            v-for="match in qfMatches"
            :key="match"
            :value="'TBA-'+match"
          >{{ getMatchTitle(match) }}</option>
        </optgroup>
        <optgroup
          v-if="sfMatches.length > 0"
          label="Semi-Final Matches"
        >
          <option
            v-for="match in sfMatches"
            :key="match"
            :value="'TBA-'+match"
          >{{ getMatchTitle(match) }}</option>
        </optgroup>
        <optgroup
          v-if="finalMatches.length > 0"
          label="Final Matches"
        >
          <option
            v-for="match in finalMatches"
            :key="match"
            :value="'TBA-'+match"
          >{{ getMatchTitle(match) }}</option>
        </optgroup>
        <optgroup label="Practice Matches">
          <option value="PRACTICE">Practice Match</option>
        </optgroup>
        <optgroup label="Mnaual Matches">
          <option value="MANUAL">Manual Match (Not recommended in most circumstances)</option>
        </optgroup>
      </select>
    </div>

    <h3
      @click="createScout()"
      class="location-centered-small background-box background-box-hover content-centered"
    >Create</h3>
  </div>
  <Error v-else>You must be logged in to create a new scout!</Error>
</template>

<script>
import PitTemplate from "../../assets/pitscout.js";
import MatchTemplate from "../../assets/matchscout.js";
import Error from "../Error.vue";
import orderBy from "lodash.orderby";

export default {
  name: "NewScout",
  components: { Error },
  props: {
    teamNumber: Number,
    localdb: Object,
    localtbadb: Object,
    user: Object,
    callback: Function,
    update: Boolean
  },
  data: function() {
    return {
      seleted: "none",
      pitScoutPrefix: "PITSCOUT_",
      matchScoutPrefix: "MATCHSCOUT_",
      pitTemplate: Object,
      matchTemplate: Object,
      loggedin: false,
      allTBAMatches: [],
      allTBAScouted: [],
      matchID: "none"
    };
  },
  methods: {
    getScoutNumber(id) {
      var scoutString = id.replace(
        this.pitScoutPrefix + this.teamNumber + "_",
        ""
      );

      scoutString = scoutString.replace(
        this.matchScoutPrefix + this.teamNumber + "_",
        ""
      );

      if (scoutString.includes("_")) {
        var inx = scoutString.indexOf("_");
        scoutString = scoutString.slice(0, inx);
      }

      return parseInt(scoutString);
    },
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
            var pitScoutNumber = 0;

            docs["rows"].forEach(doc => {
              var curNumber = dThis.getScoutNumber(doc.id) + 1;

              if (curNumber > pitScoutNumber) pitScoutNumber = curNumber;
            });

            dThis.createPitScout(pitScoutNumber);
          });
      } else if (this.seleted == "MatchScout") {
        var id = this.matchScoutPrefix + this.teamNumber + "_";

        if (this.matchID == "MANUAL") {
          this.localdb
            .allDocs({
              include_docs: false,
              startkey: dThis.matchScoutPrefix + dThis.teamNumber + "_0",
              endkey: dThis.matchScoutPrefix + dThis.teamNumber + "_\ufff0"
            })
            .then(function(docs) {
              var matchScoutNumber = 0;

              docs["rows"].forEach(doc => {
                doc.id = doc.id.slice(0, doc.id.lastIndexOf("_"));
                if (!doc.id.endsWith("_MANUAL")) return;

                var curNumber = dThis.getScoutNumber(doc.id) + 1;

                if (curNumber > matchScoutNumber) matchScoutNumber = curNumber;
              });

              id = id + matchScoutNumber + "_" + dThis.matchID;
              dThis.createMatchScout(id);
            });
        } else if (this.matchID == "PRACTICE") {
          this.localdb
            .allDocs({
              include_docs: false,
              startkey: dThis.matchScoutPrefix + dThis.teamNumber + "_0",
              endkey: dThis.matchScoutPrefix + dThis.teamNumber + "_\ufff0"
            })
            .then(function(docs) {
              var matchScoutNumber = 0;

              docs["rows"].forEach(doc => {
                doc.id = doc.id.slice(0, doc.id.lastIndexOf("_"));
                if (!doc.id.endsWith("_PRACTICE")) return;

                var curNumber = dThis.getScoutNumber(doc.id) + 1;

                if (curNumber > matchScoutNumber) matchScoutNumber = curNumber;
              });

              id = id + matchScoutNumber + "_" + dThis.matchID;
              dThis.createMatchScout(id);
            });
        } else if (this.matchID.startsWith("TBA")) {
          this.localdb
            .allDocs({
              include_docs: false,
              startkey:
                dThis.matchScoutPrefix +
                dThis.teamNumber +
                "_" +
                dThis.matchID +
                "_",
              endkey:
                dThis.matchScoutPrefix +
                dThis.teamNumber +
                "_" +
                dThis.matchID +
                "_\ufff0"
            })
            .then(docs => {
              if (docs.rows.length > 0) {
                //FIXME this scout already exists but was created by another user
                console.log("This scout already exists!");
                return;
              }

              id = id + dThis.matchID;
              dThis.createMatchScout(id);
            });
        } else {
          //ERROR SCOUT NOT SELECTED
        }
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
    createMatchScout(id) {
      var dThis = this;
      var doc = {
        _id: id + "_" + this.user.username
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
    },
    getTBAMatches() {
      var dThis = this;

      this.localtbadb.get("TEAMMATCHES_frc" + this.teamNumber).then(doc => {
        let matches = doc.json;

        matches = orderBy(
          matches,
          [
            match => {
              match = match.substring(match.indexOf("_") + 1);

              if (match.startsWith("qm")) return 0;
              else if (match.startsWith("qf")) return 1;
              else if (match.startsWith("sf")) return 2;
              else if (match.startsWith("f")) return 3;
              else return -1;
            },
            match => {
              match = match.substring(match.indexOf("_") + 1);

              if (match.startsWith("qm")) match = match.replace("qm", "");
              else if (match.startsWith("qf"))
                match = match
                  .replace("qf", "")
                  .substring(0, match.indexOf("m") - 2);
              else if (match.startsWith("sf"))
                match = match
                  .replace("sf", "")
                  .substring(0, match.indexOf("m") - 2);
              else if (match.startsWith("f"))
                match = match
                  .replace("f", "")
                  .substring(0, match.indexOf("m") - 2);
              else return -1;

              return parseInt(match);
            }
          ],
          ["asc", "asc"]
        );

        dThis.allTBAMatches.splice(0, dThis.allTBAMatches.length);
        dThis.allTBAMatches.push(...matches);
      });
    },
    getMatchTitle(matchString) {
      matchString = matchString.substring(matchString.indexOf("_") + 1);

      if (matchString.startsWith("qm"))
        return "Qual " + matchString.replace("qm", "");
      else if (matchString.startsWith("qf"))
        return (
          "QF " +
          matchString
            .replace("qf", "")
            .substring(0, matchString.indexOf("m") - 2) +
          " - Match " +
          matchString.substring(matchString.indexOf("m") + 1)
        );
      else if (matchString.startsWith("sf"))
        return (
          "SF " +
          matchString
            .replace("sf", "")
            .substring(0, matchString.indexOf("m") - 2) +
          " - Match " +
          matchString.substring(matchString.indexOf("m") + 1)
        );
      else if (matchString.startsWith("f"))
        return "Final " + matchString.substring(matchString.indexOf("m") + 1);
    },
    getAllTBAScouted() {
      var dThis = this;

      this.localdb
        .allDocs({
          include_docs: false,
          startkey: dThis.matchScoutPrefix + dThis.teamNumber + "_TBA-",
          endkey: dThis.matchScoutPrefix + dThis.teamNumber + "_TBA-\ufff0"
        })
        .then(docs => {
          dThis.allTBAScouted.splice(0, dThis.allTBAScouted.length);
          docs["rows"].forEach(doc => {
            let temp = doc.id.replace(
              this.matchScoutPrefix + this.teamNumber + "_TBA-",
              ""
            );
            temp = temp.slice(0, temp.lastIndexOf("_"));

            dThis.allTBAScouted.push(temp);
          });
        });
    }
  },
  computed: {
    qualMatches() {
      let matches = [];
      this.allTBAMatches.forEach(match => {
        let temp = match.substring(match.indexOf("_") + 1);

        if (temp.startsWith("qm") && !this.allTBAScouted.includes(match))
          matches.push(match);
      });
      return matches;
    },
    qfMatches() {
      let matches = [];
      this.allTBAMatches.forEach(match => {
        let temp = match.substring(match.indexOf("_") + 1);

        if (temp.startsWith("qf") && !this.allTBAScouted.includes(match))
          matches.push(match);
      });
      return matches;
    },
    sfMatches() {
      let matches = [];
      this.allTBAMatches.forEach(match => {
        let temp = match.substring(match.indexOf("_") + 1);

        if (temp.startsWith("sf") && !this.allTBAScouted.includes(match))
          matches.push(match);
      });
      return matches;
    },
    finalMatches() {
      let matches = [];
      this.allTBAMatches.forEach(match => {
        let temp = match.substring(match.indexOf("_") + 1);

        if (temp.startsWith("f") && !this.allTBAScouted.includes(match))
          matches.push(match);
      });
      return matches;
    }
  },
  watch: {
    update() {
      this.getTBAMatches();
      this.getAllTBAScouted();
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

      this.getTBAMatches();
      this.getAllTBAScouted();
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