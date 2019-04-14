<template>
  <div v-if="loggedin && teamExists">
    <div class="grid grid-shrink">
      <BackButton />

      <div class="location-centered-small">
        <h2 class="content-centered background-box">
          {{ team.name }} - {{ team.number }}
        </h2>

        <div class="background-box">
          <div class="grid-perminant" v-if="teaminfo.city != null">
            <p class="location-left-tiny">City:</p>
            <p class="location-right-giant content-right">
              {{ teaminfo.city }}
            </p>
          </div>

          <div class="grid-perminant" v-if="teaminfo.rookie_year != null">
            <p class="location-left">Rookie Year:</p>
            <p class="location-right content-right">
              {{ teaminfo.rookie_year }}
            </p>
          </div>

          <div class="grid-perminant" v-if="teaminfo.website != null">
            <p class="location-left-tiny">Website:</p>
            <p class="location-right-giant content-right">
              <a
                style="overflow-x: hidden;"
                :href="teaminfo.website"
                target="_blank"
                >{{ displayURL }}</a
              >
            </p>
          </div>
        </div>
      </div>

      <div class="location-left-padded">
        <h3 class="content-centered background-box">
          Total Objective Points: {{ team.objectivePoints }}
        </h3>

        <div class="background-box-input" id="scouting-select">
          <select
            v-model="scoutingSelect"
            @change="openScoutingMenu"
            class="content-input-large"
          >
            <option value>Select A Scouting Option</option>
            <option v-if="hasEdit" value="create">--- New Scout ---</option>
            <optgroup v-if="pitScouts.length > 0" label="Pit Scouts">
              <option v-for="scout in pitScouts" :key="scout" :value="scout"
                >Pit Scout {{ getScoutNumber(scout) + 1 }}</option
              >
            </optgroup>

            <optgroup
              v-if="qualMatches.length > 0"
              label="Qualification Matches"
            >
              <option
                v-for="scout in qualMatches"
                :key="scout"
                :value="scout"
                >{{ getMatchTitle(scout) }}</option
              >
            </optgroup>
            <optgroup v-if="qfMatches.length > 0" label="Quarter-Final Matches">
              <option v-for="scout in qfMatches" :key="scout" :value="scout">{{
                getMatchTitle(scout)
              }}</option>
            </optgroup>
            <optgroup v-if="sfMatches.length > 0" label="Semi-Final Matches">
              <option v-for="scout in sfMatches" :key="scout" :value="scout">{{
                getMatchTitle(scout)
              }}</option>
            </optgroup>
            <optgroup v-if="finalMatches.length > 0" label="Final Matches">
              <option
                v-for="scout in finalMatches"
                :key="scout"
                :value="scout"
                >{{ getMatchTitle(scout) }}</option
              >
            </optgroup>
            <optgroup
              v-if="manualMatches.length > 0"
              label="Practice Match Scouts"
            >
              <option
                v-for="scout in practiceMatches"
                :key="scout"
                :value="scout"
                >Practice Match {{ getScoutNumber(scout) + 1 }}</option
              >
            </optgroup>
            <optgroup
              v-if="manualMatches.length > 0"
              label="Manual Match Scouts"
            >
              <option v-for="scout in manualMatches" :key="scout" :value="scout"
                >Manual Match {{ getScoutNumber(scout) + 1 }}</option
              >
            </optgroup>
          </select>
        </div>

        <transition
          enter-active-class="content-long-fade-in"
          leave-active-class="content-long-fade-out"
        >
          <NewScout
            v-if="scoutingSelect == 'create'"
            :localdb="localdb"
            :localtbadb="localtbadb"
            :user="user"
            :teamNumber="teamNumber"
            :callback="teamCreated"
            :update="changeUpdateNewScout"
          ></NewScout>
          <ScoutMenu
            :key="scoutingSelect"
            v-else-if="scoutingSelect.startsWith('PITSCOUT_')"
            :isMatchScout="false"
            :localdb="localdb"
            :docId="scoutingSelect"
            :callback="teamModified"
            :closeteam="teamClose"
            :shouldUpdate="shouldUpdateScoutMenu"
            :hasEdit="editMode"
          ></ScoutMenu>
          <ScoutMenu
            :key="scoutingSelect"
            v-else-if="scoutingSelect.startsWith('MATCHSCOUT_')"
            :isMatchScout="true"
            :localdb="localdb"
            :docId="scoutingSelect"
            :callback="teamModified"
            :closeteam="teamClose"
            :shouldUpdate="shouldUpdateScoutMenu"
            :hasEdit="editMode"
          ></ScoutMenu>
        </transition>
      </div>
      <div class="location-right-padded">
        <h3 class="content-centered background-box">
          Total Comment Points: {{ team.commentPoints }}
        </h3>
        <transition-group name="trans-group">
          <component
            v-for="(comment, id) in comments"
            :locked="!hasEdit"
            :is="commentIs(id)"
            :modify="() => openCommentModifyMenu(id)"
            :key="id"
            :docId="id"
            :rating="comment.rating"
            :comment="comment.comment"
            :title="comment.title"
            :localdb="localdb"
            :callback="commentModified"
          ></component>
        </transition-group>

        <div v-if="hasEdit">
          <h3
            v-if="commentAddMenu == false"
            @click="openCommentAddMenu()"
            class="background-box background-box-hover content-centered"
          >
            Add comment
          </h3>

          <MenuTeamCommentAdd
            id="comment-add-menu"
            v-else
            :localdb="localdb"
            :user="user"
            :teamNumber="teamNumber"
            :callback="commentCreated"
          ></MenuTeamCommentAdd>
        </div>
      </div>
    </div>
  </div>
  <Error v-else-if="!teamExists">This team does not exist!</Error>
  <Error v-else>You must be logged in to view this page!</Error>
</template>

<script>
import MenuTeamCommentAdd from "./MenuTeamCommentAdd.vue";
import MenuTeamCommentModify from "./MenuTeamCommentModify.vue";
import CommentField from "./scouting/CommentField.vue";
import ScoutMenu from "./scouting/ScoutMenu.vue";
import NewScout from "./scouting/NewScout.vue";
import BackButton from "./BackButton.vue";
import TabContainer from "./TabContainer.vue";
import Error from "./Error.vue";
import { scroller } from "vue-scrollto/src/scrollTo";
import orderBy from "lodash.orderby";

export default {
  name: "MenuTeamView",
  components: {
    MenuTeamCommentAdd,
    MenuTeamCommentModify,
    CommentField,
    ScoutMenu,
    NewScout,
    BackButton,
    TabContainer,
    Error
  },
  props: {
    number: { type: [String, Number], required: true },
    localdb: Object,
    localtbadb: Object,
    sync_change: Object,
    user: Object
  },
  watch: {
    user: {
      handler: function(newValue) {
        if (
          newValue.role === "_admin" ||
          newValue.role === "edit" ||
          newValue.role === "view"
        ) {
          if (this.loggedin === false) {
            this.loggedin = true;
            this.initRoutine();
          }
        }
      },
      deep: true
    }
  },
  data: function() {
    return {
      teaminfo: Object,
      team: {
        name: "",
        number: 0,
        objectivePoints: 0,
        commentPoints: 0
      },
      openAddCommentMenu: false,
      comments: {
        //Change to array of _id's and make CommentField load the comment itself. Maybe?
      },
      pitScouts: [
        //List of pit scouts in order
      ],
      matchScouts: [
        //List of match scouts in order
      ],
      scoutingSelect: "",
      scoutingLoaded: 0,
      commentAddMenu: false,
      commentModifyMenu: "none",
      scrollTo: scroller(),
      shouldUpdateScoutMenu: false,
      loggedin: false,
      teamExists: false,
      pitScoutPrefix: "PITSCOUT_",
      matchScoutPrefix: "MATCHSCOUT_",
      changeUpdateNewScout: false, // Changing the state of this works as onChange
      isEditMode: true,
      matchInfo: Object,
      isTBAMatch: false
    };
  },
  methods: {
    loadComments: function() {
      //Load all comments from db then shove them into comments
      //Then check if sum of comment values == team.commentPoints
      //If not then db.get file modify commentPoints then db.put
      var dThis = this;
      this.localdb
        .allDocs({
          include_docs: true,
          startkey: "COMMENT_" + dThis.teamNumber + "_0",
          endkey: "COMMENT_" + dThis.teamNumber + "_\ufff0"
        })
        .then(function(docs) {
          dThis.comments = {};
          var totalCommentRating = 0;

          for (var docID in docs["rows"]) {
            var doc = docs["rows"][docID]["doc"];
            var comment = {
              comment: doc.comment,
              rating: parseInt(doc.rating),
              title: doc.title
            };
            totalCommentRating += comment.rating;

            dThis.$set(dThis.comments, doc["_id"], comment);
          }

          dThis.$set(dThis.team, "commentPoints", totalCommentRating);

          dThis.localdb.get("TEAM_" + dThis.teamNumber).then(function(doc) {
            if (doc.commentPoints != totalCommentRating) {
              doc.commentPoints = totalCommentRating;
              dThis.localdb.put(doc);
            }
          });
        });
    },
    openCommentAddMenu() {
      var dThis = this;
      this.commentAddMenu = true;
      this.$nextTick().then(function() {
        dThis.scrollTo("#comment-add-menu");
      });
    },
    openCommentModifyMenu(id) {
      if (this.hasEdit) {
        var dThis = this;
        this.commentModifyMenu = id;
        this.$nextTick().then(function() {
          dThis.scrollTo("#menu-team-comment-modify");
        });
      }
    },
    openScoutingMenu(change) {
      var dThis = this;
      this.getMatchInfo();
      this.$nextTick().then(function() {
        dThis.scrollTo("#scouting-select");
      });
    },
    commentCreated() {
      this.commentAddMenu = false;
      this.loadComments();
    },
    commentModified() {
      this.commentModifyMenu = "none";
      this.loadComments();
    },
    commentIs(id) {
      return this.commentModifyMenu == id
        ? "MenuTeamCommentModify"
        : "CommentField";
    },
    teamCreated(id) {
      this.scoutingSelect = id || "";
      this.loadScouting();
    },
    teamModified() {
      this.loadScouting();
    },
    teamClose() {
      this.scoutingSelect = "";
      this.loadScouting();
    },
    updateScoutMenu() {
      if (this.scoutingSelect !== "")
        this.shouldUpdateScoutMenu = !this.shouldUpdateScoutMenu;
    },
    updateNewScout() {
      this.changeUpdateNewScout = !this.changeUpdateNewScout;
    },
    loadScouting: function() {
      var dThis = this;
      var dPoints = { pPoints: 0, pAmount: 0, mPoints: 0, mAmount: 0 };
      var team = dThis.teamNumber;

      this.localdb
        .allDocs({
          include_docs: true,
          startkey: "PITSCOUT_" + team + "_0",
          endkey: "PITSCOUT_" + team + "_\ufff0"
        })
        .then(function(docs) {
          var points = 0;
          var itr = 0;
          var dDocs = docs["rows"];

          dThis.pitScouts.splice(0, dThis.pitScouts.length);
          for (var doc of dDocs) {
            dThis.pitScouts.push(doc.id);
            doc = doc["doc"];
            points += doc["TOTAL-POINTS"];
            itr++;
          }

          dThis.pitScouts = orderBy(
            dThis.pitScouts,
            [
              id => {
                return dThis.getScoutNumber(id);
              }
            ],
            ["asc"]
          );

          dPoints.pPoints += points;
          dPoints.pAmount += itr;

          return;
        })
        .then(function() {
          return dThis.localdb.allDocs({
            include_docs: true,
            startkey: "MATCHSCOUT_" + team + "_",
            endkey: "MATCHSCOUT_" + team + "_\ufff0"
          });
        })
        .then(function(docs) {
          var points = 0;
          var itr = 0;
          var dDocs = docs["rows"];
          var outDocs = [];

          dThis.matchScouts.splice(0, dThis.matchScouts.length);
          for (var doc of dDocs) {
            dThis.matchScouts.push(doc.id);
            doc = doc["doc"];
            points += doc["TOTAL-POINTS"];
            outDocs.push(doc);
            itr++;
          }

          dThis.matchScouts = orderBy(
            dThis.matchScouts,
            [
              id => {
                return dThis.getScoutNumber(id);
              }
            ],
            ["asc"]
          );

          dPoints.mPoints += points;
          dPoints.mAmount += itr;

          return;
        })
        .then(function() {
          dThis.localdb.get("TEAM_" + team).then(function(doc) {
            var matchPoints =
              dPoints.mPoints / (dPoints.mAmount > 0 ? dPoints.mAmount : 1);

            var pitPoints =
              dPoints.pPoints / (dPoints.pAmount > 0 ? dPoints.pAmount : 1);

            var points = matchPoints + pitPoints;

            points = Math.floor(points);

            dThis.$set(dThis.team, "objectivePoints", points);

            if (doc.objectivePoints != points) {
              doc.objectivePoints = points;
              dThis.localdb.put(doc);
            }
          });
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    initRoutine() {
      var dThis = this;

      this.localdb
        .get("TEAM_" + this.teamNumber)
        .then(function(doc) {
          dThis.$set(dThis.team, "name", doc.name);
          dThis.$set(dThis.team, "number", doc.number);
          dThis.$set(dThis.team, "objectivePoints", doc.objectivePoints);
          dThis.$set(dThis.team, "commentPoints", doc.commentPoints);

          dThis.teamExists = true;
        })
        .catch(function() {
          dThis.teamExists = false;
        });

      this.localtbadb
        .get("TEAMINFO_frc" + this.number)
        .then(doc => {
          dThis.teaminfo = doc.json;
        })
        .catch(err => console.log(err));

      this.loadComments();
      this.loadScouting();

      this.sync_change.onBlueAllianceDbChange = function(change) {
        if (change["direction"] == "pull") {
          var shouldLoadMatchInfo = false;

          for (var doc of change.change.docs) {
            if (
              doc["_id"].startsWith("MATCH") &&
              doc["_id"].endsWith(
                dThis.trimScout(dThis.scoutingSelect).replace("TBA-", "")
              )
            ) {
              shouldLoadMatchInfo = true;
            }
          }

          if (shouldLoadMatchInfo) dThis.getMatchInfo();
        }
      };

      this.sync_change.onChange = function(change) {
        if (change["direction"] == "pull") {
          var shouldLoadScouting = false;
          var shouldLoadComments = false;

          for (var doc of change.change.docs) {
            if (doc["_id"].startsWith("PITSCOUT_" + dThis.number + "_")) {
              shouldLoadScouting = true;
            } else if (
              doc["_id"].startsWith("MATCHSCOUT_" + dThis.number + "_")
            ) {
              shouldLoadScouting = true;
            } else if (doc["_id"].startsWith("COMMENT_" + dThis.number + "_")) {
              shouldLoadComments = true;
            }
          }

          if (shouldLoadScouting) {
            dThis.updateScoutMenu();
            dThis.loadScouting();
            dThis.updateNewScout();
          }
          if (shouldLoadComments) {
            dThis.loadComments();
          }
        }
      };
    },
    getScoutNumber(id) {
      var scoutString = id
        .replace(this.pitScoutPrefix + this.teamNumber + "_", "")
        .replace(this.matchScoutPrefix + this.teamNumber + "_", "");

      if (scoutString.includes("_")) {
        var inx = scoutString.indexOf("_");
        scoutString = scoutString.slice(0, inx);
      }

      return parseInt(scoutString);
    },
    trimScout(id) {
      let scoutString = id
        .replace(this.pitScoutPrefix + this.teamNumber + "_", "")
        .replace(this.matchScoutPrefix + this.teamNumber + "_", "");

      var inx = scoutString.lastIndexOf("_");
      return scoutString.slice(0, inx);
    },
    getMatchTitle(matchString) {
      matchString = this.trimScout(matchString);

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
    orderTBAScouts(matches) {
      return orderBy(
        matches,
        [
          match => {
            match = this.trimScout(match);
            match = match.substring(match.indexOf("_") + 1);

            if (match.startsWith("qm")) return 0;
            else if (match.startsWith("qf")) return 1;
            else if (match.startsWith("sf")) return 2;
            else if (match.startsWith("f")) return 3;
            else return -1;
          },
          match => {
            match = this.trimScout(match);
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
    },
    getMatchInfo() {
      var dThis = this;
      let temp = this.trimScout(this.scoutingSelect);

      if (!temp.startsWith("TBA")) {
        this.isTBAMatch = false;
        return;
      }
      temp = temp.replace("TBA-", "");

      this.localtbadb
        .get("MATCHSIMPLE_" + temp)
        .then(doc => {
          dThis.matchInfo = doc.json;
          dThis.isTBAMatch = true;
        })
        .catch(err => console.log(err));
    }
  },
  created: function() {
    if (
      this.user.role === "_admin" ||
      this.user.role === "edit" ||
      this.user.role === "view"
    ) {
      // User is logged in
      this.loggedin = true;
      this.initRoutine();
    } else {
      //User is not logged in
      this.loggedin = false;
    }
  },
  computed: {
    totalPoints: function() {
      return this.team.objectivePoints + this.team.commentPoints;
    },
    teamNumber() {
      return parseInt(this.number);
    },
    hasEdit() {
      return this.user.role === "_admin" || this.user.role === "edit";
    },
    editMode() {
      return this.hasEdit && this.isEditMode;
    },
    displayURL: function() {
      if (this.teaminfo.website != undefined) {
        var displayURL = this.teaminfo.website;

        var replacements = ["https://", "http://", "www."];

        replacements.forEach(
          replacement => (displayURL = displayURL.replace(replacement, ""))
        );

        return displayURL;
      } else {
        return "";
      }
    },
    qualMatches() {
      let matches = [];
      this.matchScouts.forEach(match => {
        let temp = this.trimScout(match);

        if (!temp.startsWith("TBA")) return;
        temp = temp.replace("TBA-", "");

        temp = temp.substring(temp.indexOf("_") + 1);

        if (temp.startsWith("qm")) matches.push(match);
      });
      return this.orderTBAScouts(matches);
    },
    qfMatches() {
      let matches = [];
      this.matchScouts.forEach(match => {
        let temp = this.trimScout(match);

        if (!temp.startsWith("TBA")) return;
        temp = temp.replace("TBA-", "");

        temp = temp.substring(temp.indexOf("_") + 1);

        if (temp.startsWith("qf")) matches.push(match);
      });
      return this.orderTBAScouts(matches);
    },
    sfMatches() {
      let matches = [];
      this.matchScouts.forEach(match => {
        let temp = this.trimScout(match);

        if (!temp.startsWith("TBA")) return;
        temp = temp.replace("TBA-", "");

        temp = temp.substring(temp.indexOf("_") + 1);

        if (temp.startsWith("sf")) matches.push(match);
      });
      return this.orderTBAScouts(matches);
    },
    finalMatches() {
      let matches = [];
      this.matchScouts.forEach(match => {
        let temp = this.trimScout(match);

        if (!temp.startsWith("TBA")) return;
        temp = temp.replace("TBA-", "");

        temp = temp.substring(temp.indexOf("_") + 1);

        if (temp.startsWith("f")) matches.push(match);
      });
      return this.orderTBAScouts(matches);
    },
    manualMatches() {
      let matches = [];
      this.matchScouts.forEach(match => {
        let temp = this.trimScout(match);

        if (temp.endsWith("MANUAL")) matches.push(match);
      });
      return matches;
    },
    practiceMatches() {
      let matches = [];
      this.matchScouts.forEach(match => {
        let temp = this.trimScout(match);

        if (temp.endsWith("PRACTICE")) matches.push(match);
      });
      return matches;
    }
  }
};
</script>

<style>
#scouting-select {
  margin-bottom: 20px;
}
.content-long-fade-in {
  animation: fade-in 0.4s ease;
}
.content-long-fade-out {
  animation: fade-out 0.1s ease;
}
</style>