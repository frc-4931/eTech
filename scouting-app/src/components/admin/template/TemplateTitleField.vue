<template>
  <div class="grid template-item">
    <p class="background-box">
      Title Field
    </p>

    <div class="background-box location-centered">
      <input class="content-centered" type="text" placeholder="Title" v-model="title">
    </div>

    <div class="background-box background-box-hover">
      <p>Options</p>
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
