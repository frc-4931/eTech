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

            <div class="content-expandable">
                <div class="background-box grid-perminant">
                    <p class="location-left-giant">Test</p>
                    <p class="location-right-tiny">Test</p>
                </div>

                <div class="background-box">
                    <p>Test</p>
                </div>
            </div>
        </div>

        <div class="location-right-padded">
            <div class="background-box background-box-hover content-expand-toggle">
                <h3 class="content-centered">Total Comment Points: <span> {{team.commentPoints}} </span></h3>
            </div>

            <div id="team-popup-addcomment" class="background-box background-box-hover">
                <h3 class="content-centered">Add comment</h3>
            </div>

            <div id="team-popup-comments" class="content-expandable">
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: "MenuTeamView",
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
      }
    };
  },
  created: function() {
    var dThis = this;
    this.localdb.get("TEAM_" + this.teamNumber).then(function(doc) {
      dThis.$set(dThis.team, "name", doc.name);
      dThis.$set(dThis.team, "number", doc.number);
      dThis.$set(dThis.team, "objectivePoints", doc.objectivePoints);
      dThis.$set(dThis.team, "commentPoints", doc.commentPoints);
    });
  },
  computed: {
    totalPoints: function() {
      return this.team.objectivePoints + this.team.commentPoints;
    }
  }
};
</script>

<style>
</style>

