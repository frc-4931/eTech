<template>
  <div id="menu-team-comment-add">
    <div class="line" />

    <h2 class="content-centered background-box">Add comment</h2>

    <div class="background-box">
      <input
        v-model.trim="title"
        type="text"
        name="comment-title"
        placeholder="Comment Title"
        required
      />
    </div>

    <div class="background-box">
      <textarea
        v-model.trim="comment"
        rows="10"
        type="text"
        name="comment-content"
        placeholder="Comment"
        required
      ></textarea>
    </div>

    <div class="background-box">
      <select
        v-model="rating"
        name="comment-points"
        required
      >
        <option
          value="Invalid"
          selected="selected"
          disabled
        >Select Point Value for Comment</option>
        <option value="1">Positive</option>
        <option value="0">Neutral</option>
        <option value="-1">Negative</option>
      </select>
    </div>

    <h3
      @click="submitComment()"
      class="location-centered-small background-box content-centered"
      :class="[
        this.allFieldsValid ? 'background-box-hover' : 'background-box-disabled'
      ]"
    >
      Add
    </h3>
    <h3
      @click="callback"
      class="location-centered-small background-box background-box-hover content-centered"
    >
      Cancel
    </h3>

    <div class="line" />
  </div>
</template>

<script>
export default {
  name: "MenuTeamCommentAdd",
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
      commentNumber: 0
    };
  },
  methods: {
    submitComment: function() {
      if (this.user.username != null) {
        //Check if user is logged in
        var dThis = this;
        if (this.allFieldsValid) {
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
          this.localdb.putHASH(comment).then(function() {
            dThis.callback();
          });
        }
      }
    }
  },
  computed: {
    allFieldsValid: function() {
      return this.title != "" && this.comment != "" && this.rating != "Invalid";
    }
  },
  created() {
    var dThis = this;

    this.localdb
      .allDocsHASH({
        include_docs: false,
        startkey: "COMMENT_" + dThis.teamNumber + "_0",
        endkey: "COMMENT_" + dThis.teamNumber + "_\ufff0"
      })
      .then(function(docs) {
        if (docs["rows"].length !== 0) {
          var lastCommentIDN = 0;

          for (let doc of docs["rows"]) {
            var id = doc["id"];
            var curIDN = id.replace("COMMENT_" + dThis.teamNumber + "_", "");
            if (curIDN.includes("_")) {
              var inx = curIDN.indexOf("_");
              curIDN = curIDN.slice(0, inx);
            }
            var num = parseInt(curIDN);
            if (num > lastCommentIDN) lastCommentIDN = num;
          }
          dThis.commentNumber = lastCommentIDN + 1;
        }
      });
  }
};
</script>