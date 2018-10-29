<template>
  <div class="grid template-item">
    <p class="background-box">Number Field</p>

    <div class="background-box">
      <input type="text" placeholder="Title" v-model="title">
    </div>

    <div class="background-box">
      <input type="text" placeholder="JSON Field" v-model="field">
    </div>

    <div class="background-box">
      <input type="number" placeholder="True Points" v-model.number="tPoints">
    </div>

    <div class="background-box">
      <input type="number" placeholder="False Points" v-model.number="fPoints">
    </div>

    <div class="background-box background-box-hover">
      <p>Options</p>
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
