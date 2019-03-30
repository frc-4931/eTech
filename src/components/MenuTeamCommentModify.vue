<template>
  <div id="menu-team-comment-modify">
    <div class="line"/>
    <FieldError v-if="error"></FieldError>
    <div v-else class="background-box">
      <h2 class="content-centered">Modify comment</h2>
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
        <h3>Save</h3>
      </div>
      <div @click="deleteComment()" class="location-centered-small background-box background-box-hover content-centered">
        <h3>Delete</h3>
      </div>
    </div>
    <div @click="callback()" class="location-centered-small background-box background-box-hover content-centered">
      <h3>Cancel</h3>
    </div>
    <div class="line"/>
  </div>
</template>

<script>
import FieldError from "./scouting/FieldError.vue";

export default {
  name: "MenuTeamCommentModify",
  components: {
    FieldError
  },
  props: {
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
      commentNumber: 0,
      error: false
    };
  },
  methods: {
    submitComment: function() {
      var dThis = this;
      if (this.title != "" && this.comment != "") {
        this.localdb.get(this.docId).then(function(doc) {
          doc.title = dThis.title;
          doc.comment = dThis.comment;
          doc.rating = parseInt(dThis.rating);

          dThis.localdb.put(doc).then(function() {
            dThis.callback();
          });
        });
      } else {
        this.error = true;
      }
    },
    deleteComment: function() {
      var dThis = this;
      var should_delete = confirm(
        "Are you sure you want to delete this comment?\nThis operation cannot be undone!"
      );
      if (should_delete) {
        this.localdb.get(this.docId).then(function(doc) {
          dThis.localdb.remove(doc).then(function() {
            dThis.callback();
          });
        });
      }
    }
  },
  computed: {
    number: function() {
      return parseInt(this.docId.replace("COMMENT_", "").slice(0, -2));
    }
  },
  created() {
    var dThis = this;
    this.localdb.get("TEAM_" + dThis.number).then(function(doc) {
      dThis.name = doc.name || "";
    });

    this.localdb.get(this.docId).then(function(doc) {
      dThis.title = doc.title || "";
      dThis.comment = doc.comment || "";
      dThis.rating = doc.rating;
    });
  }
};
</script>