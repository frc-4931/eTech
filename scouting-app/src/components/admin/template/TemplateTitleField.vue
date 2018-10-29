<template>
  <div class="grid template-item content-centered">
    <div class="background-box location-centered-small template-title">
      <h3>Title Field</h3>
    </div>

    <div class="background-box background-box-hover template-options">
      <p>Options</p>
    </div>

    <div class="background-box location-centered-small">
      <input class="content-centered" type="text" placeholder="Title" v-model="title">
    </div>

  </div>
</template>

<script>
export default {
  name: "TemplateTitleField",
  data: function() {
    return {
      title: ""
    };
  }
};
</script>

<style>
</style>
