<template>
  <div class="grid template-item">
    <p class="background-box">Boolean Field</p>

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
  </div>
</template>

<script>
export default {
  name: "TemplateBooleanField",
  data: function() {
    return {
      title: "",
      field: "",
      tPoints: 1,
      fPoints: 0
    };
  }
};
</script>

<style>
</style>
