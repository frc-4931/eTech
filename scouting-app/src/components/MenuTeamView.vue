<template>
<div id="menu-team-view">
    <div class="grid">
        <div v-on:click="homePage()" class="location-centered-small background-box background-box-hover content-centered">
            <h3>Done</h3>
        </div>

        <div class="location-centered background-box">
            <h2 class="content-centered"><span id="team-popup-name"></span> - <span id="team-popup-number">{{ teamNumber }}</span></h2>
        </div>

        <div class="location-left-padded">
            <div class="background-box background-box-hover content-expand-toggle">
                <h3 class="content-centered">Total Objective Points: <span id="team-popup-objectivepoints"></span></h3>
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
                <h3 class="content-centered">Total Comment Points: <span id="team-popup-commentpoints"></span></h3>
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
    homePage: Function,
    teamNumber: Number
  }
};
</script>

<style>
</style>

