<template>
  <div>
    <h3 class="content-centered background-box">
      Total Objective Points: {{ team.objectivePoints }}
    </h3>

    <div
      class="background-box-input"
      id="scouting-select"
    >
      <select
        v-model="curSelected"
        @change="openScoutingMenu"
        class="content-input-large"
      >
        <option value>Select A Scouting Option</option>
        <option
          v-if="hasEdit"
          value="create"
        >--- New Scout ---</option>
        <optgroup
          v-if="pitScouts.length > 0"
          label="Pit Scouts"
        >
          <option
            v-for="scout in pitScouts"
            :key="scout"
            :value="scout"
          >Pit Scout {{ getScoutNumber(scout) + 1 }}</option>
        </optgroup>

        <optgroup
          v-if="qualMatches.length > 0"
          label="Qualification Matches"
        >
          <option
            v-for="scout in qualMatches"
            :key="scout"
            :value="scout"
          >{{ getMatchTitle(scout) }}</option>
        </optgroup>
        <optgroup
          v-if="qfMatches.length > 0"
          label="Quarter-Final Matches"
        >
          <option
            v-for="scout in qfMatches"
            :key="scout"
            :value="scout"
          >{{ getMatchTitle(scout) }}</option>
        </optgroup>
        <optgroup
          v-if="sfMatches.length > 0"
          label="Semi-Final Matches"
        >
          <option
            v-for="scout in sfMatches"
            :key="scout"
            :value="scout"
          >{{ getMatchTitle(scout) }}</option>
        </optgroup>
        <optgroup
          v-if="finalMatches.length > 0"
          label="Final Matches"
        >
          <option
            v-for="scout in finalMatches"
            :key="scout"
            :value="scout"
          >{{ getMatchTitle(scout) }}</option>
        </optgroup>
        <optgroup
          v-if="practiceMatches.length > 0"
          label="Practice Match Scouts"
        >
          <option
            v-for="scout in practiceMatches"
            :key="scout"
            :value="scout"
          >Practice Match {{ getScoutNumber(scout) + 1 }}</option>
        </optgroup>
        <optgroup
          v-if="manualMatches.length > 0"
          label="Manual Match Scouts"
        >
          <option
            v-for="scout in manualMatches"
            :key="scout"
            :value="scout"
          >Manual Match {{ getScoutNumber(scout) + 1 }}</option>
        </optgroup>
      </select>
    </div>

    <transition
      enter-active-class="content-fade-in"
      leave-active-class="content-fade-out"
      mode="out-in"
    >
      <NewScout
        v-if="scoutingSelect == 'create'"
        :localdb="localdb"
        :localtbadb="localtbadb"
        :user="user"
        :teamNumber="teamNumber"
        :callback="teamCreated"
        :update="changeUpdateNewScout"
      ></NewScout>
      <ScoutMenu
        :key="scoutingSelect"
        v-else-if="scoutingSelect.startsWith(user.scoutingHash.hash + 'PITSCOUT_')"
        :isMatchScout="false"
        :localdb="localdb"
        :docId="scoutingSelect"
        :callback="teamModified"
        :closeteam="teamClose"
        :shouldUpdate="shouldUpdateScoutMenu"
        :hasEdit="editMode"
      ></ScoutMenu>
      <ScoutMenu
        :key="scoutingSelect"
        v-else-if="scoutingSelect.startsWith(user.scoutingHash.hash + 'MATCHSCOUT_')"
        :isMatchScout="true"
        :localdb="localdb"
        :docId="scoutingSelect"
        :callback="teamModified"
        :closeteam="teamClose"
        :shouldUpdate="shouldUpdateScoutMenu"
        :hasEdit="editMode"
      ></ScoutMenu>
    </transition>
  </div>
</template>

<script>
import ScoutMenu from "./scouting/ScoutMenu.vue";
import NewScout from "./scouting/NewScout.vue";

export default {
  name: "ScoutingTab",
  components: {
    ScoutMenu,
    NewScout
  },
  data() {
    return {
      curSelected: ""
    };
  },
  watch: {
    curSelected(newVal) {
      this.setScoutingSelect(newVal);
    },
    scoutingSelect(newVal) {
      this.curSelected = newVal;
    }
  },
  props: [
    "team",
    "scoutingSelect",
    "openScoutingMenu",
    "hasEdit",
    "pitScouts",
    "getScoutNumber",
    "getMatchTitle",
    "qualMatches",
    "qfMatches",
    "sfMatches",
    "finalMatches",
    "practiceMatches",
    "manualMatches",
    "localdb",
    "localtbadb",
    "user",
    "teamNumber",
    "teamCreated",
    "changeUpdateNewScout",
    "teamModified",
    "teamClose",
    "shouldUpdateScoutMenu",
    "editMode",
    "setScoutingSelect"
  ]
};
</script>

<style>
</style>
