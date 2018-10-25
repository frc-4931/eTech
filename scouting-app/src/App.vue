<template>
  <div id="app">
    <transition enter-active-class="content-fade-in" leave-active-class="content-fade-out" mode="out-in">
      <component v-bind:is="ativeComponent" :localdb="localdb" :pages="pages" :teamNumber="teamNumber" :callback="callback" :id="id"></component>
    </transition>
    <ConnectionError v-if="isConnectionError"></ConnectionError>
  </div>
</template>

<script>
import MenuMain from "./components/MenuMain.vue";
import MenuTeamAdd from "./components/MenuTeamAdd.vue";
import MenuTeamCommentAdd from "./components/MenuTeamCommentAdd.vue";
import MenuTeamCommentModify from "./components/MenuTeamCommentModify.vue";
import ConnectionError from "./components/ConnectionError.vue";
import MenuTeamView from "./components/MenuTeamView.vue";
import PouchDB from "pouchdb";

export default {
  name: "app",
  components: {
    MenuMain,
    MenuTeamAdd,
    ConnectionError,
    MenuTeamView,
    MenuTeamCommentAdd,
    MenuTeamCommentModify
  },
  data: function() {
    return {
      ativeComponent: "MenuMain",
      isConnectionError: false,
      teamNumber: 4931,
      localdb: new PouchDB("localdb"),
      callback: Function,
      id: String,
      pages: {}
    };
  },
  methods: {
    toMenuMain: function() {
      this.ativeComponent = "MenuMain";
    },
    toMenuAddTeam: function() {
      this.ativeComponent = "MenuTeamAdd";
    },
    toMenuTeamView: function(team) {
      this.teamNumber = team;
      this.ativeComponent = "MenuTeamView";
    },
    toMenuTeamCommentAdd: function(team, callback) {
      this.teamNumber = team;
      this.callback = callback;
      this.ativeComponent = "MenuTeamCommentAdd";
    },
    toMenuTeamCommentModify: function(id, callback) {
      this.id = id;
      this.callback = callback;
      this.ativeComponent = "MenuTeamCommentModify";
    }
  },
  created: function() {
    //Register app pages
    this.pages.toMenuMain = this.toMenuMain;
    this.pages.toMenuAddTeam = this.toMenuAddTeam;
    this.pages.toMenuTeamView = this.toMenuTeamView;
    this.pages.toMenuTeamCommentAdd = this.toMenuTeamCommentAdd;
    this.pages.toMenuTeamCommentModify = this.toMenuTeamCommentModify;
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("./css/normalize.css");

.leaderboard-team {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  text-align: center;
}
body {
  font-family: "Open Sans", sans-serif;
  background-color: #455a64;
  color: #eceff1;
}
.content-centered {
  text-align: center;
}
.content-right {
  text-align: right;
}
.content-fade-in-out {
  animation: fade-in 0.2s ease-in-out;
}
.content-fade-in {
  animation: fade-in 0.1s ease;
}
.content-fade-out {
  animation: fade-out 0.1s ease;
}
.background-box {
  background-color: #37474f;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6);
  padding: 10px;
  margin: 10px;
}
.background-box-hover {
  transition: all 0.2s ease-in-out;
}
.background-box-hover:hover {
  background-color: #546e7a;
}
.background-box-hover:active {
  background-color: #b0bec5;
}
.comment-contents {
  padding-left: 20px;
  padding-right: 20px;
}
.comment-title {
  margin-bottom: 10px;
}

h1,
h2,
h3,
p {
  margin: 0;
  font-weight: normal;
}
a {
  transition: all 0.2s ease-in-out;
  color: #2196f3;
}
a:hover {
  color: #0069c0;
}
input,
textarea,
select {
  width: 100%;
  padding: 10px;
  display: inline-block;
  box-sizing: border-box;
  background-color: #37474f;
  border: #455a64 solid 1px;
  color: #eceff1;
}
.grid-perminant {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}
.location-span {
  grid-column: 1/7;
}
.location-left {
  grid-column: 1/4;
}
.location-right {
  grid-column: 4/7;
}
.location-centered {
  grid-column: 2/6;
}
.location-centered-small {
  grid-column: 3/5;
}
.location-left-small {
  grid-column: 1/3;
}
.location-left-large {
  grid-column: 1/5;
}
.location-right-small {
  grid-column: 5/7;
}
.location-right-large {
  grid-column: 3/7;
}
.location-left-tiny {
  grid-column: 1/2;
}
.location-left-giant {
  grid-column: 1/6;
}
.location-right-tiny {
  grid-column: 6/7;
}
.location-right-giant {
  grid-column: 2/7;
}
.location-left-padded {
  grid-column: 2/4;
}
.location-right-padded {
  grid-column: 4/6;
}
@media (min-width: 700px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>