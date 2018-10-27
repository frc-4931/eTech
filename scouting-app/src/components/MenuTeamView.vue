<template>
<div id="menu-team-view">
  <div class="grid">
    <div v-on:click="pages.toMenuMain()" id="done-button" class="location-centered-small background-box background-box-hover content-centered">
      <h3>Done</h3>
    </div>

    <div id="team-title" class="location-centered background-box">
        <h2 class="content-centered"><span>{{ team.name }}</span> - <span>{{ team.number }}</span></h2>
    </div>

    <div class="location-left-padded">
      <!--<div class="line"></div>-->

      <div class="background-box">
        <h3 class="content-centered">Total Objective Points: <span>{{ team.objectivePoints }}</span></h3>
      </div>

      <div id="scouting-select" class="background-box">
        <select v-model="scoutingSelect">
          <option value="none">Select A Scouting Option</option>
          <option v-for="(scout, idx) in pitScouts" :key="scout" :value="scout">Pit Scouting - {{ idx + 1 }}</option>
          <option v-for="(scout, idx) in matchScouts" :key="scout" :value="scout">Match Scouting - Match {{ idx + 1 }}</option>
          <option value="create"> --- New Scout --- </option>
        </select>
      </div>
      <!-- Insert Scouting Fields Here -->     
      <transition enter-active-class="content-fade-in" leave-active-class="content-fade-out" mode="out-in">      
        <NewScout v-if="scoutingSelect == 'create' " :localdb="localdb" :teamNumber="teamNumber" :callback="teamCreated"></NewScout> 
        <ScoutMenu :key="scoutingSelect" v-else-if="scoutingSelect.startsWith('PITSCOUT_')" :isMatchScout="false" :localdb="localdb" :id="scoutingSelect" :callback="teamModified"></ScoutMenu>
        <ScoutMenu :key="scoutingSelect" v-else-if="scoutingSelect.startsWith('MATCHSCOUT_')" :isMatchScout="true" :localdb="localdb" :id="scoutingSelect" :callback="teamModified"></ScoutMenu>
      </transition>
    </div>

    <div class="location-right-padded">
      <!--<div class="line"></div>-->

      <div class="background-box">
        <h3 class="content-centered">Total Comment Points: <span> {{team.commentPoints}} </span></h3>
      </div>

      <CommentField v-for="(comment, id) in comments" :modify="function() {pages.toMenuTeamCommentModify(id, closeCommentMenu)}" v-bind:key="id" :rating="comment.rating" :comment="comment.comment" :title="comment.title"></CommentField>

      <div v-on:click="pages.toMenuTeamCommentAdd(teamNumber, closeCommentMenu)" class="background-box background-box-hover">
        <h3 class="content-centered">Add comment</h3>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MenuTeamCommentAdd from "./MenuTeamCommentAdd.vue";
import CommentField from "./scouting/CommentField.vue";
import ScoutMenu from "./scouting/ScoutMenu.vue";
import NewScout from "./scouting/NewScout.vue";

export default {
  name: "MenuTeamView",
  components: {
    MenuTeamCommentAdd,
    CommentField,
    ScoutMenu,
    NewScout
  },
  props: {
    pages: Object,
    teamNumber: Number,
    localdb: Object,
    remotedb: Object
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
      scoutingLoaded: 0
    };
  },
  methods: {
    closeCommentMenu: function() {
      this.pages.toMenuTeamView(this.teamNumber);
    },
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
      //TODO: THIS NEEDS TO BE DONE NEXT
      var dThis = this;
      this.loadScouting = 0;
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
          dThis.loadScouting++;
          if (dThis.loadScouting === 2) {
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
          dThis.loadScouting++;
          if (dThis.loadScouting === 2) {
            //If both scouting types have loaded
            dThis.loadObjectivePoints();
          }
        });
    },
    teamCreated(id) {
      this.scoutingSelect = id || "none";
      this.loadScouting();
    },
    teamModified() {
      this.loadObjectivePoints();
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
    }
  },
  created: function() {
    var dThis = this;
    this.localdb.get("TEAM_" + this.teamNumber).then(function(doc) {
      dThis.$set(dThis.team, "name", doc.name);
      dThis.$set(dThis.team, "number", doc.number);
      dThis.$set(dThis.team, "objectivePoints", doc.objectivePoints);
      dThis.$set(dThis.team, "commentPoints", doc.commentPoints);
    });

    this.loadComments();
    this.loadScouting();
  },
  computed: {
    totalPoints: function() {
      return this.team.objectivePoints + this.team.commentPoints;
    }
  }
};
</script>

<style>
.line {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) calc(50% - 1px),
    #cfd8dc calc(50%),
    rgba(0, 0, 0, 0) calc(50% + 1px)
  );
  padding: 5px;
  margin: 10px;
}
#scouting-select {
  margin-bottom: 20px;
  text-align-last: center;
  font-size: 20px;
}
@media (max-width: 700px) {
  #done-button {
    margin-left: 25px;
    margin-right: 25px;
  }
}
</style>

