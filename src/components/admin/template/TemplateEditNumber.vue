<template>
  <div>
    <div class="line"></div>
    <div class="background-box content-centered">
      <h3>Edit Number Field</h3>
    </div>

    <div class="field-edit">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model="title">
      </div>

      <p class="background-box">JSON Field Name</p>
      <div class="background-box-input">
        <input type="text" placeholder="Field Name" v-model="field">
      </div>

      <p class="background-box">Default value</p>
      <div class="background-box-input">
        <input type="number" placeholder="Default Number" v-model-number="dNumber">
      </div>

      <p class="background-box">Points awarded per 1 entered</p>
      <div class="background-box-input">
        <input type="number" placeholder="Points Per 1 Entered" v-model-number="scaler">
      </div>

      <p class="background-box">Minimum</p>
      <div class="background-box-input">
        <input type="number" placeholder="Minimum" v-model-number="minimum">
      </div>
    </div>
    <div class="grid-perminant content-centered">
      <div class="location-span background-box background-box-hover">
        <p>Save</p>
      </div>
      <div class="location-left-small background-box background-box-hover">
        <p>Delete</p>
      </div>
      <div class="location-centered-small background-box background-box-hover">
        <p>Move Up</p>
      </div>
      <div class="location-right-small background-box background-box-hover">
        <p>Move Down</p>
      </div>
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