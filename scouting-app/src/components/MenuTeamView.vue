<template>
<div id="menu-team-view">
    <div class="grid">
        <div v-on:click="pages.toMenuMain()" class="location-centered-small background-box background-box-hover content-centered">
            <h3>Done</h3>
        </div>

        <div class="location-centered background-box">
            <h2 class="content-centered"><span>{{ team.name }}</span> - <span>{{ team.number }}</span></h2>
        </div>

        <div class="location-left-padded">
            <div class="background-box background-box-hover content-expand-toggle">
                <h3 class="content-centered">Total Objective Points: <span>{{ team.objectivePoints }}</span></h3>
            </div>

            <form class="grid-perminant pit-scout-div">
                <div class="background-box location-left">
                    <p>Blocks scored etc?</p>
                </div>


                <div class="background-box location-right">
                    <input class="pit-scout-input" type="number" pattern="[0-9]*" max="9999" min="-9999" placeholder="Value" name="changethisplz">
                </div>
            </form>

            <form class="grid-perminant pit-scout-div">
                <div class="background-box location-left">
                    <p>Drivetrain?</p>
                </div>


                <div class="background-box location-right">
                    <select class="pit-scout-input" required>
                        <option value="invalid" selected disabled>Please Select</option>
                        <option value="normal">Normal</option>
                        <option value="weird">Weird</option>
                        <option value="otherweird">Other Weird</option>
                    </select>
                </div>
            </form>

            <form class="grid-perminant pit-scout-div">
                <div class="background-box location-left">
                    <p>Are they good?</p>
                </div>

                <div class="location-right background-box grid-perminant">
                    <label class="location-left">
                        <input class="radio-button" type="radio" name="radio1">
                        True
                    </label>

                    <label class="location-right">
                        <input class="radio-button" type="radio" name="radio1">
                        False
                    </label>
                </div>
            </form>

        </div>

        <div class="location-right-padded">
            <div class="background-box background-box-hover content-expand-toggle">
                <h3 class="content-centered">Total Comment Points: <span> {{team.commentPoints}} </span></h3>
            </div>

            <CommentField v-for="(comment, id) in comments" v-bind:key="id" :rating="comment.rating" :comment="comment.comment" :title="comment.title"></CommentField>

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

export default {
  name: "MenuTeamView",
  components: {
    MenuTeamCommentAdd,
    CommentField
  },
  props: {
    pages: Object,
    teamNumber: Number,
    localdb: Object
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
        //Change to array of _id's and make CommentField load the comment itself.
      }
    };
  },
  methods: {
    closeCommentMenu: function() {
      this.pages.toMenuTeamView(this.teamNumber);
    },
    loadComments: function() {
      //Load all comments from db then shove them into comments (make array)
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
            doc.commentPoints = totalCommentRating;
            dThis.localdb.put(doc);
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
.pit-scout-input {
  padding: 0px;
}
.pit-scout-div div {
  margin-top: 0px;
}
.pit-scout-div:nth-child(1) div {
  margin-top: 10px;
}
.radio-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid #eceff1;
  transition: 0.2s all ease-in-out;
  outline: none;
  margin-right: 5px;
  position: relative;
  top: 4px;
}
.radio-button:checked {
  border: 6px solid #607d8b;
}
</style>

