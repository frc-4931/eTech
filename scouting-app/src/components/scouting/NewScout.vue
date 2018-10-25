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
      pitScoutPrefix: "PITSCOUT_"
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
              pitScoutNumber =
                parseInt(
                  docs["rows"][len - 1].id.replace(
                    dThis.pitScoutPrefix + dThis.teamNumber + "_",
                    ""
                  )
                ) + 1;
            }
            dThis.createPitScout(pitScoutNumber);
          });
      } else if (this.seleted == "MatchScout") {
        alert("Match Scout not supported yet");
      } else {
        alert("You must choose a scouting type!");
      }
    },
    createPitScout(number) {
      alert(number);

      var doc = {
        _id: this.pitScoutPrefix + this.teamNumber + "_" + number
      };

      for (var item of this.pitTemplate) {
        if (item["type"] != "TitleField") {
          doc[item["field"]] = item["default"];
        }
      }
      this.localdb.put(doc);
      this.callback();
    }
  },
  created() {
    var dThis = this;
    //FINSIH ME. Loads all scouting files and puts ID's into array.
    this.localdb
      .get("TEMPLATE_PITSCOUT")
      .then(function(doc) {
        dThis.pitTemplate = doc.fields;
      })
      .catch(function() {
        var doc = {
          fields: PitTemplate.fields,
          _id: "TEMPLATE_PITSCOUT"
        };
        dThis.localdb.put(doc);
        dThis.pitTemplate = doc.fields;
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
