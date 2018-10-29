<template>
  <div>
    <div class="line"></div>
    <div class="background-box content-centered">
      <h3>Edit Boolean Field</h3>
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
        <select>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <p class="background-box">Points awarded if true</p>
      <div class="background-box-input">
        <input type="number" placeholder="True Points" v-model-number="tPoints">
      </div>

      <p class="background-box">Points awarded if false</p>
      <div class="background-box-input">
        <input type="number" placeholder="False Points" v-model-number="fPoints">
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
  name: "TemplateEditBoolean",
  props: {
    type: String,
    title: String
  }
};
</script>