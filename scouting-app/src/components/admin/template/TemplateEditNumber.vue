<template>
  <div>
    <div class="line"></div>
    <div class="background-box content-centered">
      <h3>Edit Number Field</h3>
    </div>

    <div class="field-edit">
      <p>Title</p>
      <input type="text" placeholder="Title" v-model="title">

      <p>JSON Field Name</p>
      <input type="text" placeholder="Field Name" v-model="field">

      <p>Default value</p>
      <input type="number" placeholder="Default Number" v-model-number="dNumber">

      <p>Points awarded per 1 entered</p>
      <input type="number" placeholder="Points per 1 entered" v-model-number="scaler">

      <p>Minimum</p>
      <input type="number" placeholder="Minimum" v-model-number="minimum">
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: "TemplateEditNumber",
  props: {
    type: String,
    title: String
  }
};
</script>