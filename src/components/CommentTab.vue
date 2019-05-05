<template>
  <div>
    <h3 class="content-centered background-box">
      Total Comment Points: {{ team.commentPoints }}
    </h3>
    <transition-group name="trans-group">
      <component
        v-for="comment in comments"
        :locked="!hasEdit"
        :is="commentIs(comment._id)"
        :modify="() => openCommentModifyMenu(comment._id)"
        :key="comment._id"
        :docId="comment._id"
        :rating="comment.rating"
        :comment="comment.comment"
        :title="comment.title"
        :localdb="localdb"
        :callback="commentModified"
        :popup="popup"
      ></component>
    </transition-group>

    <div v-if="hasEdit">
      <h3
        v-if="commentAddMenu == false"
        @click="openCommentAddMenu()"
        class="background-box background-box-hover content-centered"
      >
        Add comment
      </h3>

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
</template>

<script>
import MenuTeamCommentAdd from "./MenuTeamCommentAdd.vue";
import MenuTeamCommentModify from "./MenuTeamCommentModify.vue";
import CommentField from "./scouting/CommentField.vue";

export default {
  name: "CommentTab",
  components: {
    MenuTeamCommentAdd,
    MenuTeamCommentModify,
    CommentField
  },
  props: {
    localdb: Object,
    user: Object,
    teamNumber: Number,
    commentCreated: Function,
    openCommentAddMenu: Function,
    commentAddMenu: Boolean,
    popup: Object,
    commentModified: Function,
    openCommentModifyMenu: Function,
    commentIs: Function,
    hasEdit: Boolean,
    comments: Array,
    team: Object
  }
};
</script>

<style>
</style>
