<template>
  <div id="app">
    <transition enter-active-class="content-fade-in" leave-active-class="content-fade-out" mode="out-in">
      <router-view :localdb="localdb" :username="username"></router-view>
    </transition>

    <ConnectionError v-if="isConnectionError"></ConnectionError>
  </div>
</template>

<script>
import ConnectionError from "./components/ConnectionError.vue";
import PouchDB from "pouchdb";
import Authentication from "pouchdb-authentication";
import PitTemplate from "./assets/pitscout.js";
import MatchTemplate from "./assets/matchscout.js";

export default {
  name: "app",
  components: {
    ConnectionError
  },
  data: function() {
    return {
      isConnectionError: false,
      teamNumber: 4931,
      localdb: new PouchDB("localdb"),
      remotedb: new PouchDB("localhost:5984/scoutingData"),
      sync: Object,
      username: "user"
    };
  },
  methods: {},
  created: function() {
    var doc_pit = {};
    doc_pit.fields = PitTemplate.fields;
    doc_pit._id = "TEMPLATE_PITSCOUT";
    this.localdb.put(doc_pit).catch(function() {});

    var doc_match = {};
    doc_match.fields = MatchTemplate.fields;
    doc_match._id = "TEMPLATE_MATCHSCOUT";
    this.localdb.put(doc_match).catch(function() {});

    PouchDB.plugin(Authentication);
    // this.remotedb
    //   .getSession()
    //   .then(function(respone) {
    //     console.log(respone);
    //   })
    //   .catch(function(err) {
    //     if (err.name == "unknown") console.log("You are not logged in!");
    //   });

    // this.remotedb.info().then(function(info) {
    //   console.log(info);
    // });

    // var sync = this.localdb
    //   .sync(this.remotedb, {
    //         live: true,
    //         retry: true
    //   })
    //   .on("error", function(err) {
    //     console.log(err);
    //   });
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("./css/normalize.css");

@media (max-width: 700px) {
  .done-button-container {
    margin-left: 25px;
    margin-right: 25px;
  }
}
.content-input-large {
  text-align-last: center;
  font-size: 18px;
}
.background-box-input {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
  margin: 10px;
  background-color: #37474f;
}

*:focus {
  outline: none;
}
body {
  font-family: "Open Sans", sans-serif;
  background-color: #455a64;
  color: #eceff1;
  overflow: auto;
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
  padding: 10px;
  margin: 10px;
}
.comment-contents {
  padding-left: 20px;
  padding-right: 20px;
}
.comment-title {
  margin-bottom: 10px;
}
.line {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) calc(50% - 1px),
    #cfd8dc calc(50%),
    rgba(0, 0, 0, 0) calc(50% + 1px)
  );
  padding: 5px;
  margin: 10px;
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
  text-decoration: none;
}
a:active {
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
  border: none;
}
input,
textarea {
  -webkit-appearance: none;
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
@supports (-webkit-overflow-scrolling: touch) {
  select {
    -webkit-appearance: none;
  }
  .grid > *,
  .grid-perminant > * {
    margin-bottom: 20px;
  }
}
@media (min-width: 700px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
  .background-box-hover {
    transition: all 0.2s ease-in-out;
  }
  .background-box-hover:hover {
    background-color: #546e7a;
  }
  a:hover {
    color: #0069c0;
  }
  .mobile-view {
    display: none;
  }
}
@media (max-width: 700px) {
  .grid > * {
    margin-bottom: 20px;
  }
  .desktop-view {
    display: none;
  }
  .mobile-none-margin-top {
    margin-top: 0px;
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