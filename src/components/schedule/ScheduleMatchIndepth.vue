<template>
  <div class="background-box grid">
    <h3 class="content-centered location-span">Qualifier 40</h3>

    <div class="schedule-match-indepth-score location-centered-small content-centered">
      <p class="schedule-match-indepth-score-blue">69</p>
      <p class="schedule-match-indepth-score-red">69</p>
    </div>

    <div class="schedule-match-indepth-teams location-centered-small content-centered">
      <p class="schedule-match-indepth-blue">1234</p>
      <p class="schedule-match-indepth-blue">1234</p>
      <p class="schedule-match-indepth-blue">1234</p>
      <p class="schedule-match-indepth-red schedule-match-indepth-red-active">1534</p>
      <p class="schedule-match-indepth-red">1234</p>
      <p class="schedule-match-indepth-red">1344</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.schedule-match-indepth-teams {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}
.schedule-match-indepth-score {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.schedule-match-indepth-score-red {
  color: var(--tba-alliance-red);
}
.schedule-match-indepth-score-blue {
  color: var(--tba-alliance-blue);
}
.schedule-match-indepth-red-active {
  color: var(--text-color) !important;
  background-color: var(--tba-alliance-red);
}
.schedule-match-indepth-blue-active {
  color: var(--text-color) !important;
  background-color: var(--tba-alliance-blue);
}
.schedule-match-indepth-red {
  color: var(--tba-alliance-red);
}
.schedule-match-indepth-blue {
  color: var(--tba-alliance-blue);
}
</style>