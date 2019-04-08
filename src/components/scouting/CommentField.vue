<template>
  <div>
    <div v-on:click="fullComment = !fullComment" class="background-box">
      <h2 class="content-centered">{{title}}</h2>

      <div v-if="fullComment">
        <pre>{{this.comment}}</pre>
        <h3 v-if="getTruncatedMessage.length < this.comment.length" class="content-centered toggle-view-more">Show less</h3>
      </div>

      <div v-else>
        <pre>{{getTruncatedMessage + (this.comment.length > this.maxTruncatedLength ? "..." : "")}}</pre>
        <h3 v-if="getTruncatedMessage.length < this.comment.length" class="content-centered toggle-view-more">Show more</h3>
      </div>
    </div>

    <div class="grid-perminant comment-field-buttons content-centered">
      <p class="location-left background-box" :style="color">Value: {{getRating}}</p>
      <p @click="modify()" v-bind:class="[this.locked ? 'background-box-disabled' : 'background-box-hover']" class="location-right background-box">Edit</p>
    </div>
  </div>
</template>

<script>
//Modify so CommentField gets comment from passed in _id instead of getting data from passed in data.
//On comment submit run callback to update fields in MenuTeamView

export default {
  name: "CommentField",
  props: {
    comment: String,
    rating: Number,
    title: String,
    modify: Function,
    locked: Boolean
  },
  data: function() {
    return {
      color: "color: var(--neutral)",
      fullComment: false,
      maxTruncatedLength: 200
    };
  },
  computed: {
    getRating() {
      var prefix = "Neutral";
      var dThis = this;
      if (this.rating > 0) {
        prefix = "Positive";
        dThis.color = "color: var(--positive)";
      } else if (this.rating < 0) {
        prefix = "Negative";
        dThis.color = "color: var(--negative)";
      }
      return prefix;
    },
    getTruncatedMessage() {
      return this.comment
        .replace(/(\r\n|\n|\r)/gm, "")
        .slice(0, this.maxTruncatedLength);
    }
  }
};
</script>

<style>
.comment-field-buttons > * {
  margin-top: 0px;
}
.comment-field-buttons > *:nth-child(1) {
  margin-right: 5px;
}
.comment-field-buttons > *:nth-child(2) {
  margin-left: 5px;
}
.toggle-view-more {
  color: var(--neutral);
}
</style>