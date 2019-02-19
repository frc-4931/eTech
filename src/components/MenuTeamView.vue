<template>
  <div
    v-if="loggedin && teamExists"
    id="menu-team-view"
  >
    <div class="grid">
      <div class="location-centered-small done-button-container">
        <div
          @click="goBack()"
          class="background-box background-box-hover content-centered"
        >
          <h3>Back</h3>
        </div>
      </div>
      <div class="location-centered background-box">
        <h2 class="content-centered">
          {{ team.name }} - {{ team.number }}
        </h2>
      </div>
      <div class="location-left-padded">
        <div class="background-box">
          <h3 class="content-centered">Total Objective Points: {{ team.objectivePoints }}</h3>
        </div>
        <div
          class="background-box-input"
          id="scouting-select"
        >
          <select
            v-model="scoutingSelect"
            @change="openScoutingMenu()"
            class="content-input-large"
          >
            <option value="none">Select A Scouting Option</option>
            <option
              v-if="hasEdit"
              value="create"
            >--- New Scout ---</option>
            <option
              v-for="(scout, idx) in pitScouts"
              :key="scout"
              :value="scout"
            >Pit Scouting: {{ idx + 1 }}</option>
            <option
              v-for="(scout, idx) in matchScouts"
              :key="scout"
              :value="scout"
            >Match Scouting: Match {{ idx + 1 }}</option>
          </select>
        </div>

        <div
          v-if="scoutingSelect != 'none'"
          class="line"
        ></div>

        <transition
          enter-active-class="content-long-fade-in"
          leave-active-class="content-long-fade-out"
          mode="out-in"
        >
          <NewScout
            v-if="scoutingSelect == 'create' "
            :localdb="localdb"
            :user="user"
            :teamNumber="teamNumber"
            :callback="teamCreated"
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
            :callUpdated="updatedScoutMenu"
            :hasEdit="hasEdit"
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
            :callUpdated="updatedScoutMenu"
            :hasEdit="hasEdit"
          ></ScoutMenu>
        </transition>
      </div>
      <div class="location-right-padded">
        <h3 class="content-centered background-box">Total Comment Points: {{team.commentPoints}}</h3>
        <!-- <transition-group name="comment-menu"> -->
        <!-- beautify ignore:start -->
          <component v-for="(comment, id) in comments"
            :locked="!hasEdit"
            :is="commentIs(id)"
            :modify="function() {openCommentModifyMenu(id)}"
            :key="id"
            :docId="id"
            :rating="comment.rating"
            :comment="comment.comment"
            :title="comment.title"
            :localdb="localdb"
            :callback="commentModified">
          </component>
          <!-- beautify ignore:end -->
        <!-- </transition-group> -->

        <div v-if="hasEdit">
          <h3
            v-if="commentAddMenu == false"
            @click="openCommentAddMenu()"
            class="background-box background-box-hover content-centered"
          >Add comment</h3>

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
import Error from "./Error.vue";
import { scroller } from "vue-scrollto/src/scrollTo";

export default {
  name: "MenuTeamView",
  components: {
    MenuTeamCommentAdd,
    MenuTeamCommentModify,
    CommentField,
    ScoutMenu,
    NewScout,
    Error
  },
  props: {
    number: { type: [String, Number], required: true },
    localdb: Object,
    remotedb: Object,
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
      scoutingSelect: "none",
      scoutingLoaded: 0,
      commentAddMenu: false,
      commentModifyMenu: "none",
      scrollTo: scroller(),
      shouldUpdateScoutMenu: false,
      loggedin: false,
      teamExists: false
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
    loadScouting: function() {
      var dThis = this;
      this.scoutingLoaded = 0;
      this.localdb
        .allDocs({
          include_docs: false,
          startkey: "PITSCOUT_" + dThis.teamNumber + "_0",
          endkey: "PITSCOUT_" + dThis.teamNumber + "_\ufff0"
        })
        .then(function(docs) {
          dThis.pitScouts.splice(0, dThis.pitScouts.length);
          for (var doc of docs["rows"]) {
            dThis.pitScouts.push(doc.id);
          }

          return;
        })
        .then(function() {
          dThis.scoutingLoaded++;
          if (dThis.scoutingLoaded === 2) {
            //If both scouting types have loaded
            dThis.loadObjectivePoints();
          }
        });

      this.localdb
        .allDocs({
          include_docs: false,
          startkey: "MATCHSCOUT_" + dThis.teamNumber + "_0",
          endkey: "MATCHSCOUT_" + dThis.teamNumber + "_\ufff0"
        })
        .then(function(docs) {
          dThis.matchScouts.splice(0, dThis.matchScouts.length);
          for (var doc of docs["rows"]) {
            dThis.matchScouts.push(doc.id);
          }

          return;
        })
        .then(function() {
          dThis.scoutingLoaded++;
          if (dThis.scoutingLoaded === 2) {
            //If both scouting types have loaded
            dThis.loadObjectivePoints();
          }
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
    openScoutingMenu() {
      var dThis = this;
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
      this.scoutingSelect = id || "none";
      this.loadScouting();
    },
    teamModified() {
      this.loadObjectivePoints();
    },
    teamClose() {
      this.scoutingSelect = "none";
      this.loadScouting();
    },
    updateScoutMenu() {
      if (this.scoutingSelect !== "none") this.shouldUpdateScoutMenu = true;
    },
    updatedScoutMenu() {
      this.shouldUpdateScoutMenu = false;
    },
    loadObjectivePoints() {
      var dThis = this;
      var allScoutingIds = this.matchScouts.concat(this.pitScouts);

      this.localdb
        .allDocs({
          include_docs: true,
          keys: allScoutingIds
        })
        .then(function(docs) {
          if (docs["rows"].length === 0) return;

          var totalObjectiveRating = 0;

          for (var doc of docs["rows"]) {
            totalObjectiveRating += doc["doc"]["TOTAL-POINTS"] || 0; //Maybe make a function to return total objective points. If sperate function make a file that has a function (doc) -> {for (i in field) put(doc.field_points = calc_points); return rating}.
          }

          var avgerageObjectiveRating =
            totalObjectiveRating / docs["rows"].length;
          avgerageObjectiveRating = Math.floor(avgerageObjectiveRating);

          dThis.$set(dThis.team, "objectivePoints", avgerageObjectiveRating);

          dThis.localdb.get("TEAM_" + dThis.teamNumber).then(function(doc) {
            if (doc.objectivePoints != avgerageObjectiveRating) {
              doc.objectivePoints = avgerageObjectiveRating;
              dThis.localdb.put(doc);
            }
          });
        });
    },
    goBack() {
      this.$router.push("/admin/");
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

      this.loadComments();
      this.loadScouting();

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
          }
          if (shouldLoadComments) {
            dThis.loadComments();
          }
        }
      };
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
    }
  }
};
</script>

<style scoped>
#scouting-select {
  margin-bottom: 20px;
}
.content-long-fade-in {
  animation: fade-in 0.4s ease;
}
.content-long-fade-out {
  animation: fade-out 0.1s ease;
}
.comment-menu-enter {
  transition: 0.5s;
  opacity: 0;
}
.comment-menu-leave-to {
  transition: 0s;
  opacity: 0;
}
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 0px repeat(4, 1fr) 0px;
  }
}
</style>