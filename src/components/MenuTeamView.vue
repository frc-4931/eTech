<template>
  <div v-if="loggedin && teamExists">
    <div class="grid grid-shrink">
      <div class="location-centered-small">
        <h2 class="content-centered background-box">
          {{ team.name }} - {{ team.number }}
        </h2>

        <div class="background-box">
          <div
            class="grid-perminant"
            v-if="teaminfo.city != null"
          >
            <p class="location-left-tiny">City:</p>
            <p class="location-right-giant content-right">
              {{ teaminfo.city }}
            </p>
          </div>

          <div
            class="grid-perminant"
            v-if="teaminfo.rookie_year != null"
          >
            <p class="location-left">Rookie Year:</p>
            <p class="location-right content-right">
              {{ teaminfo.rookie_year }}
            </p>
          </div>

          <div
            class="grid-perminant"
            v-if="teaminfo.website != null"
          >
            <p class="location-left-tiny">Website:</p>
            <p class="location-right-giant content-right">
              <a
                style="overflow-x: hidden;"
                :href="teaminfo.website"
                target="_blank"
              >{{ displayURL }}</a>
            </p>
          </div>
        </div>
      </div>

      <TabContainer
        :tabs="['Scouting', 'Comments']"
        :initialTab="'Scouting'"
        class="location-centered-small"
      >
        <ScoutingTab
          slot="tab-panel-scouting"
          :team="team"
          :scoutingSelect="scoutingSelect"
          :openScoutingMenu="openScoutingMenu"
          :hasEdit="hasEdit"
          :pitScouts="pitScouts"
          :getScoutNumber="getScoutNumber"
          :getMatchTitle="getMatchTitle"
          :qualMatches="qualMatches"
          :qfMatches="qfMatches"
          :sfMatches="sfMatches"
          :finalMatches="finalMatches"
          :practiceMatches="practiceMatches"
          :manualMatches="manualMatches"
          :localdb="localdb"
          :localtbadb="localtbadb"
          :user="user"
          :teamNumber="teamNumber"
          :teamCreated="teamCreated"
          :changeUpdateNewScout="changeUpdateNewScout"
          :teamModified="teamModified"
          :teamClose="teamClose"
          :shouldUpdateScoutMenu="shouldUpdateScoutMenu"
          :editMode="editMode"
          :setScoutingSelect="setScoutingSelect"
          :popup="popup"
        ></ScoutingTab>
        <CommentTab
          slot="tab-panel-comments"
          :localdb="localdb"
          :user="user"
          :teamNumber="teamNumber"
          :commentCreated="commentCreated"
          :openCommentAddMenu="openCommentAddMenu"
          :commentAddMenu="commentAddMenu"
          :popup="popup"
          :commentModified="commentModified"
          :openCommentModifyMenu="openCommentModifyMenu"
          :commentIs="commentIs"
          :hasEdit="hasEdit"
          :comments="comments"
          :team="team"
        ></CommentTab>
      </TabContainer>
    </div>
  </div>
  <Error v-else-if="!teamExists">This team does not exist!</Error>
  <Error v-else>You must be logged in to view this page!</Error>
</template>

<script>
import MenuTeamCommentAdd from "./MenuTeamCommentAdd.vue";
import MenuTeamCommentModify from "./MenuTeamCommentModify.vue";
import CommentField from "./scouting/CommentField.vue";
import TabContainer from "./TabContainer.vue";
import CommentTab from "./CommentTab.vue";
import ScoutingTab from "./ScoutingTab.vue";
import Error from "./Error.vue";
import { scroller } from "vue-scrollto/src/scrollTo";
import orderBy from "lodash.orderby";

export default {
  name: "MenuTeamView",
  components: {
    TabContainer,
    CommentTab,
    ScoutingTab,
    Error
  },
  props: {
    popup: Object,
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
      comments: [
        //Change to array of _id's and make CommentField load the comment itself. Maybe?
      ],
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
      //If not then db.getHASH file modify commentPoints then db.putHASH
      var dThis = this;
      this.localdb
        .allDocsHASH({
          include_docs: true,
          startkey: "COMMENT_" + dThis.teamNumber + "_0",
          endkey: "COMMENT_" + dThis.teamNumber + "_\ufff0"
        })
        .then(function(docs) {
          dThis.comments.splice(0, dThis.comments.length);
          var totalCommentRating = 0;

          for (var docID in docs["rows"]) {
            var doc = docs["rows"][docID]["doc"];
            var comment = {
              _id: doc["_id"],
              comment: doc.comment,
              rating: parseInt(doc.rating),
              title: doc.title
            };
            totalCommentRating += comment.rating;

            dThis.comments.push(comment);
          }

          dThis.comments = orderBy(
            dThis.comments,
            [
              comment => {
                return dThis.getCommentNumber(comment._id);
              }
            ],
            ["asc"]
          );

          dThis.$set(dThis.team, "commentPoints", totalCommentRating);

          dThis.localdb.getHASH("TEAM_" + dThis.teamNumber).then(function(doc) {
            if (doc.commentPoints != totalCommentRating) {
              doc.commentPoints = totalCommentRating;
              dThis.localdb.putHASH(doc);
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
    setScoutingSelect(val) {
      this.scoutingSelect = val;
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
        .allDocsHASH({
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
          return dThis.localdb.allDocsHASH({
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
          dThis.localdb.getHASH("TEAM_" + team).then(function(doc) {
            var matchPoints =
              dPoints.mPoints / (dPoints.mAmount > 0 ? dPoints.mAmount : 1);

            var pitPoints =
              dPoints.pPoints / (dPoints.pAmount > 0 ? dPoints.pAmount : 1);

            var points = matchPoints + pitPoints;

            points = Math.floor(points);

            dThis.$set(dThis.team, "objectivePoints", points);

            if (doc.objectivePoints != points) {
              doc.objectivePoints = points;
              dThis.localdb.putHASH(doc);
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
        .getHASH("TEAM_" + this.teamNumber)
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
        .getHASH("TEAMINFO_frc" + this.number)
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
    getCommentNumber(id) {
      var commentString = id.replace("COMMENT_" + this.teamNumber + "_", "");

      if (commentString.includes("_")) {
        var inx = commentString.indexOf("_");
        commentString = commentString.slice(0, inx);
      }

      return parseInt(commentString);
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
        .getHASH("MATCHSIMPLE_" + temp)
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