<template>
  <div id="menu-team-comment-modify">
    <div class="line" />

    <h2 class="content-centered background-box">Modify comment</h2>

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
      Save
    </h3>
    <h3
      @click="deleteComment()"
      class="location-centered-small background-box background-box-hover content-centered"
    >
      Delete
    </h3>
    <h3
      @click="callback()"
      class="location-centered-small background-box background-box-hover content-centered"
    >
      Cancel
    </h3>

    <div class="line" />
  </div>
</template>

<script>
export default {
  name: "MenuTeamCommentModify",
  props: {
    popup: Object,
    callback: Function,
    localdb: Object,
    docId: String
  },
  data: function() {
    return {
      title: "",
      comment: "",
      rating: "Invalid",
      name: String,
      commentNumber: 0
    };
  },
  methods: {
    submitComment: function() {
      var dThis = this;
      if (this.allFieldsValid) {
        this.localdb.getHASH(this.docId).then(function(doc) {
          doc.title = dThis.title;
          doc.comment = dThis.comment;
          doc.rating = parseInt(dThis.rating);

          dThis.localdb.putHASH(doc).then(function() {
            dThis.callback();
          });
        });
      }
    },
    deleteComment: function() {
      var dThis = this;

      this.popup
        .newPopup(
          "Delete Comment?",
          "Are you sure you want to delete this comment?\nThis operation cannot be undone!",
          ["Cancel", "Delete"]
        )
        .then(option => {
          if (option == "Delete") {
            this.localdb.getHASH(this.docId).then(function(doc) {
              dThis.localdb.removeHASH(doc).then(function() {
                dThis.callback();
              });
            });
          }
        });
    }
  },
  computed: {
    number: function() {
      return parseInt(this.docId.replace("COMMENT_", "").slice(0, -2));
    },
    allFieldsValid: function() {
      return this.title != "" && this.comment != "";
    }
  },
  created() {
    var dThis = this;
    this.localdb.getHASH("TEAM_" + dThis.number).then(function(doc) {
      dThis.name = doc.name || "";
    });

    this.localdb.getHASH(this.docId).then(function(doc) {
      dThis.title = doc.title || "";
      dThis.comment = doc.comment || "";
      dThis.rating = doc.rating;
    });
  }
};
</script>