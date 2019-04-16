<template>
  <div class="scout-div">
    <div class="background-box content-centered scouting-title-field">
      <h2>{{ data.title }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleField",
  props: {
    data: Object
  }
};
</script>

<style>
.scouting-title-field {
  margin-top: 20px !important;
}
</style>