<template>
<div id="menu-team-comment-add">

    <div class="grid">
        <div v-on:click="callback" class="location-centered-small background-box background-box-hover content-centered">
            <h3>Cancel</h3>
        </div>

        <div class="location-centered-small background-box">
            <h2 class="content-centered">Add comment: {{ name }} #{{ teamNumber }}</h2>
        </div>

        <div class="location-centered-small">
            <div class="background-box">
                <input v-model="title" type="text" name="comment-title" placeholder="Comment Title" required>
            </div>

            <div class="background-box">
                <textarea v-model="comment" rows="10" type="text" name="comment-content" placeholder="Comment" required></textarea>
            </div>

            <div class="background-box">
                <select v-model="rating" name="comment-points" required>
                    <option value="Invalid" selected="selected" disabled>Select Point Value for Comment</option>
                    <option value="2">+2</option>
                    <option value="1">+1</option>
                    <option value="0">Neutral</option>
                    <option value="-1">-1</option>
                    <option value="-2">-2</option>
                </select>
            </div>
        </div>

        <div class="location-centered-small background-box background-box-hover"><input v-on:click="submitComment()" type="button" value="Submit"></div>
    </div>

    <FieldError v-if="error"></FieldError>
</div>
</template>

<script>
import FieldError from "./scouting/FieldError.vue";

export default {
  name: "MenuTeamCommentAdd",
  components: {
    FieldError
  },
  props: {
    callback: Function,
    localdb: Object,
    teamNumber: Number
  },
  data: function() {
    return {
      title: "",
      comment: "",
      rating: "Invalid",
      name: String,
      commentNumber: 0,
      error: false
    };
  },
  methods: {
    submitComment: function() {
      if (this.title != "" && this.comment != "" && this.rating != "Invalid") {
        var comment = {
          comment: this.comment,
          rating: parseInt(this.rating),
          title: this.title,
          _id: "COMMENT_" + this.teamNumber + "_" + this.commentNumber
        };
        this.localdb.put(comment);
        this.callback();
      } else {
        this.error = true;
      }
    }
  },
  created() {
    var dThis = this;
    this.localdb.get("TEAM_" + dThis.teamNumber).then(function(doc) {
      dThis.name = doc.name;
    });

    this.localdb
      .allDocs({
        include_docs: false,
        startkey: "COMMENT_" + dThis.teamNumber + "_0",
        endkey: "COMMENT_" + dThis.teamNumber + "_\ufff0"
      })
      .then(function(docs) {
        if (docs["rows"].length > 0) {
          var last = docs["rows"].length - 1;
          var id = docs["rows"][last]["id"];
          var lastCommentIDN = id.replace(
            "COMMENT_" + dThis.teamNumber + "_",
            ""
          );
          var lCommentNum = parseInt(lastCommentIDN);
          dThis.commentNumber = lCommentNum + 1;
        }
      });
  }
};
</script>

<style>
</style>
