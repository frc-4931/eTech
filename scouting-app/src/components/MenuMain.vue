<template>
<div id="menu-main">
    <div class="grid">
        <div class="location-span background-box">
            <h1 class="content-centered">FRC 4931 Scouting app</h1>
            <p>This is my (Damian) scouting application for FRC 4931. It's only a proof of concept at this state</p>
        </div>

        <div class="location-left-large">
            <div class="background-box">
                <h2 class="content-centered">Leaderboard</h2>
                <p>Teams are given a rating by combining various different pieces of information collected by team
                    members</p>
            </div>

            <div class="background-box leaderboard-team">
                <div>
                    <p>Team Name</p>
                </div>
                <div>
                    <p>Team Number</p>
                </div>

                <div>
                    <p>Objective Points</p>
                </div>

                <div>
                    <p>Comment Points</p>
                </div>

                <div>
                    <p>Total Points</p>
                </div>
            </div>
            

            <div id="leaderboard-container">
                <LeaderboardTeam :homePage="homePage" :openTeam="openTeam"></LeaderboardTeam>
            </div>
        </div>

        <div class="location-right-small">
            <div class="background-box">
                <h2 class="content-centered">Tools</h2>
                <a id="tools-add-team" v-on:click="teamPage()">Add team</a>
                <p>Remove team</p>
                <p>Edit member permissions</p>
            </div>

            <div class="background-box">
                <h2 class="content-centered">Member Leaderboard</h2>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import LeaderboardTeam from "./LeaderboardTeam.vue";

export default {
  name: "MenuMain",
  components: {
    LeaderboardTeam
  },
  props: {
    msg: String,
    teamPage: Function,
    homePage: Function,
    openTeam: Function
  }
};
</script>

<style>
</style>
