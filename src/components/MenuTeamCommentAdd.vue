<template>
  <div id="menu-team-comment-add">

    <div class="line" />

    <Error v-if="isError">{{ errorMessage }}</Error>

    <div v-else class="background-box">
      <h2 class="content-centered">Add comment</h2>
    </div>

    <div>
      <div class="background-box">
        <input v-model="title" type="text" name="comment-title" placeholder="Comment Title" required>
      </div>

      <div class="background-box">
        <textarea v-model="comment" rows="10" type="text" name="comment-content" placeholder="Comment" required></textarea>
      </div>

      <div class="background-box">
        <select v-model="rating" name="comment-points" required>
          <option value="Invalid" selected="selected" disabled>Select Point Value for Comment</option>
          <option value="5">+5</option>
          <option value="4">+4</option>
          <option value="3">+3</option>
          <option value="2">+2</option>
          <option value="1">+1</option>
          <option value="0">Neutral</option>
          <option value="-1">-1</option>
          <option value="-2">-2</option>
          <option value="-3">-3</option>
          <option value="-4">-4</option>
          <option value="-5">-5</option>
        </select>
      </div>
    </div>

    <div>
      <div @click="submitComment()" class="location-centered-small background-box background-box-hover content-centered">
        <h3>Add</h3>
      </div>
      <div @click="callback" class="location-centered-small background-box background-box-hover content-centered">
        <h3>Cancel</h3>
      </div>
    </div>

    <div class="line" />
  </div>
</template>

<script>
import Error from "./Error.vue";

export default {
  name: "MenuTeamCommentAdd",
  components: {
    Error
  },
  props: {
    callback: Function,
    localdb: Object,
    user: Object,
    teamNumber: Number
  },
  data: function() {
    return {
      title: "",
      comment: "",
      rating: "Invalid",
      commentNumber: 0,
      isError: false,
      errorMessage: ""
    };
  },
  methods: {
    submitComment: function() {
      if (this.user.username != null) {
        //Check if user is logged in
        var dThis = this;
        if (
          this.title != "" &&
          this.comment != "" &&
          this.rating != "Invalid"
        ) {
          var comment = {
            comment: this.comment,
            rating: parseInt(this.rating),
            title: this.title,
            _id:
              "COMMENT_" +
              this.teamNumber +
              "_" +
              this.commentNumber +
              "_" +
              this.user.username
          };
          this.localdb.put(comment).then(function() {
            dThis.callback();
          });
        } else {
          this.isError = true;
          this.errorMessage = "All fields are required!";
        }
      } else {
        //If user if not logged in throw error you must be logged in
        this.isError = true;
        this.errorMessage = "You must be logged in to create a new comment!";
      }
    }
  },
  created() {
    var dThis = this;

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